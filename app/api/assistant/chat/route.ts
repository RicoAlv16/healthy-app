import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatAction {
  label: string;
  type: "link" | "call" | "action";
  target: string;
  variant?: "primary" | "danger" | "secondary";
}

interface ChatResponsePayload {
  reply: string;
  severity: "normal" | "moderate" | "emergency";
  suggestedActions: ChatAction[];
  quickReplies: string[];
}

// Moteur de connaissances médicales et sanitaires locales du Bénin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, lang = "fr" } = body as {
      message: string;
      history?: Message[];
      lang: "fr" | "fon";
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message requis." },
        { status: 400 }
      );
    }

    const query = message.trim().toLowerCase();

    // 1. Détection des Urgences Vitales (Code Rouge)
    const emergencyKeywords = [
      "inconscient", "ne respire plus", "étouffe", "convulsion", "crise cardiaque", 
      "douleur thoracique intense", "coma", "hémorragie", "accident grave", 
      "saignement abondant", "paralysie brutale", "avc", "poison", "intoxication", 
      "brûlure grave", "morsure de serpent", "malaise grave"
    ];

    const isEmergency = emergencyKeywords.some((kw) => query.includes(kw));

    if (isEmergency) {
      const replyFr = 
        `🚨 **URGENCE MÉDICALE VITALE DÉTECTÉE (Code Rouge)**\n\n` +
        `Ces symptômes requièrent une intervention médicale immédiate.\n\n` +
        `• **Contactez sans délai le SAMU National du Bénin** au numéro vert gratuit **112** ou **(+229) 21 30 06 56**.\n` +
        `• Si vous êtes à Cotonou, rendez-vous immédiatement aux **Urgences du CNHU-HKM** ou du **Centre Hospitalier Universitaire de la Mère et de l'Enfant (CHU-MEL)**.\n` +
        `• Allongez la personne en position latérale de sécurité (PLS) si elle est inconsciente et ne lui donnez rien à boire ni à manger.`;

      const replyFon = 
        `🚨 **AZƆN SYƐNSYƐN É BLA WU (Code Vɔvɔ / Urgence)**\n\n` +
        `Azɔn é lɔ byɔ ɖɔ a ni yi dotoxwé tlolo bo ma d'alɔ o!\n\n` +
        `• **Ylɔ SAMU Bénin tɔn tlolo ɖo 112** (kpe kpo gbɔn alokan jí vɔvɔ).\n` +
        `• Yi CNHU-HKM Kutɔnu alò dotoxwé ɖaxó e sɛkpɔ we é.\n` +
        `• Ma na sin alò amasin mɛ kpo o, d'asɔ mɛ ɔ ganji.`;

      return NextResponse.json<ChatResponsePayload>({
        reply: lang === "fon" ? replyFon : replyFr,
        severity: "emergency",
        suggestedActions: [
          {
            label: "📞 Appeler le SAMU Bénin (112)",
            type: "call",
            target: "tel:112",
            variant: "danger",
          },
          {
            label: "🏥 Urgences CNHU Cotonou (+229 21 30 01 55)",
            type: "call",
            target: "tel:+22921300155",
            variant: "danger",
          },
        ],
        quickReplies: [
          "Que faire en attendant les secours ?",
          "Position latérale de sécurité (PLS)",
          "Contacter un proche"
        ]
      });
    }

    // 2. Détection Paludisme & Fièvre
    if (
      query.includes("palu") || 
      query.includes("fièvre") || 
      query.includes("fievre") || 
      query.includes("frisson") || 
      query.includes("courbature") || 
      query.includes("zozo") ||
      query.includes("asɔn")
    ) {
      const replyFr = 
        `🌡️ **Suspicion de Paludisme / Syndrome Fébrile (Code Jaune)**\n\n` +
        `Au Bénin, la fièvre et les courbatures sont fréquemment évocatrices d'un accès palustre (*Plasmodium falciparum*).\n\n` +
        `**Recommandations immédiates :**\n` +
        `1. Réalisez un **Test de Diagnostic Rapide (TDR)** ou une goutte épaisse en centre de santé ou laboratoire.\n` +
        `2. En cas de confirmation, le protocole national préconise une **CTA (Combinaison Thérapeutique à base d'Artémisinine)** comme l'Artéméther-Luméfantrine (Coartem) sur avis médical.\n` +
        `3. Pour faire baisser la fièvre en attendant, buvez abondamment de l'eau et prenez du paracétamol (1g max par prise chez l'adulte, espacé de 6h). *Évitez l'aspirine ou les anti-inflammatoires sans avis médical.*\n\n` +
        `Souhaitez-vous planifier une consultation ou une téléconsultation avec un médecin ?`;

      const replyFon = 
        `🌡️ **Asɔn / Paludisme (Kpɔ́n ganji)**\n\n` +
        `Nú agbaza towe fya bo ɖò zozo d'emɛ, è sixu nyí asɔn (paludisme).\n\n` +
        `1. Yi dotoxwé bo bló TDR (tɛsi asɔn tɔn) tlolo.\n` +
        `2. Nú é nyí asɔn nǔgbo ɔ, dotóo na na we amasin CTA (Coartem).\n` +
        `3. Nu sin gégé, bo se Paracétamol nú agbaza zozo ɔ ni jɛ do.\n\n` +
        `A jló na mɔ dotóo ɖé gbɔn alokan jí à ?`;

      return NextResponse.json<ChatResponsePayload>({
        reply: lang === "fon" ? replyFon : replyFr,
        severity: "moderate",
        suggestedActions: [
          {
            label: "📅 Prendre RDV avec un Médecin",
            type: "link",
            target: "/dashboard#appointments",
            variant: "primary"
          },
          {
            label: "💊 Trouver une pharmacie ouverte",
            type: "link",
            target: "#pharmacies",
            variant: "secondary"
          }
        ],
        quickReplies: [
          "Quels sont les signes de gravité du palu ?",
          "Prendre rendez-vous au CNHU",
          "Posologie du Paracétamol"
        ]
      });
    }

    // 3. Questions sur la prise de rendez-vous et téléconsultation
    if (
      query.includes("rendez-vous") || 
      query.includes("rdv") || 
      query.includes("consulter") || 
      query.includes("téléconsultation") || 
      query.includes("visio") ||
      query.includes("docteur") ||
      query.includes("médecin")
    ) {
      const replyFr = 
        `📅 **Module de Prise de Rendez-vous & Téléconsultation**\n\n` +
        `Sur Care.bj, vous pouvez prendre rendez-vous en quelques clics :\n\n` +
        `• **Dans votre Tableau de Bord Citoyen** : Cliquez simplement sur le bouton vert **« Prendre un Rendez-vous »** dans la barre latérale ou en haut de page.\n` +
        `• **Choix du Praticien** : Sélectionnez votre médecin (*ex: Dr. Florent AGBO en Médecine Interne au CNHU, Dr. Armelle HOUNKPONOU au CHD Zou-Collines, Dr. Hospice MENSAH à Ménontin...*).\n` +
        `• **Format au choix** : Consultation physique à l'hôpital ou **Téléconsultation Vidéo Frugale** adaptée aux connexions 3G/2G.\n` +
        `• **Confirmation SMS** : Vous et votre médecin recevez un SMS d'alerte automatique avec les détails de la consultation.`;

      const replyFon = 
        `📅 **Dotóo mɔmɔ kpo Alokan jí kpo**\n\n` +
        `Ɖo Care.bj jí ɔ, a sixu mɔ dotóo bɔwú:\n\n` +
        `• Zé alɔ dó **« Prendre un Rendez-vous »** jí ɖo dashboard towe mɛ.\n` +
        `• Sɔ́ dotóo e a jlo é (CNHU, Ménontin, Porto-Novo).\n` +
        `• A sixu kpé é nǔgbo nǔgbo alò a na ɖɔ xó n'î gbɔn alokan jí (vidéo basse connexion).\n` +
        `• È na sɛ́ SMS d'alokan towe jí bo na kɛnu nu we.`;

      return NextResponse.json<ChatResponsePayload>({
        reply: lang === "fon" ? replyFon : replyFr,
        severity: "normal",
        suggestedActions: [
          {
            label: "📅 Ouvrir la Réservation de RDV",
            type: "link",
            target: "/dashboard#appointments",
            variant: "primary"
          }
        ],
        quickReplies: [
          "Quels hôpitaux sont connectés ?",
          "Comment fonctionne la téléconsultation ?",
          "Combien coûte une consultation ?"
        ]
      });
    }

    // 4. Questions sur le NPI, l'ANIP et la Carte Sanitaire Souveraine
    if (
      query.includes("npi") || 
      query.includes("anip") || 
      query.includes("carte") || 
      query.includes("identifiant") || 
      query.includes("cip")
    ) {
      const replyFr = 
        `🆔 **Identifiant National NPI & Carte Sanitaire Numérique ANIP**\n\n` +
        `Le **Numéro Personnel d'Identification (NPI)** à 10 chiffres attribué par l'ANIP Bénin est la clé d'accès unique à votre Dossier Médical Partagé (DMP).\n\n` +
        `• **Avantages** : Il rassemble vos antécédents, votre groupe sanguin, vos allergies, vos ordonnances et vos vaccins sans risque de doublon.\n` +
        `• **Carte Sanitaire Virtuelle** : Téléchargeable ou consultable dans votre espace avec son QR Code officiel certifié, lisible hors-ligne par les hôpitaux et pharmacies béninoises.\n` +
        `• **Sécurité APDP** : Vos données biométriques et cliniques restent strictement protégées au Data Center National de Parakou.`;

      return NextResponse.json<ChatResponsePayload>({
        reply: replyFr,
        severity: "normal",
        suggestedActions: [
          {
            label: "💳 Afficher ma Carte Sanitaire ANIP",
            type: "link",
            target: "/dashboard",
            variant: "primary"
          }
        ],
        quickReplies: [
          "Où trouver mon numéro NPI ?",
          "Comment modifier mes allergies ?",
          "Qu'est-ce que le protocole Bris de Glace ?"
        ]
      });
    }

    // 5. Questions sur les Pharmacies et Ordonnances
    if (
      query.includes("pharmacie") || 
      query.includes("garde") || 
      query.includes("médicament") || 
      query.includes("ordonnance") || 
      query.includes("ordonances") ||
      query.includes("officine")
    ) {
      const replyFr = 
        `💊 **Pharmacies de Garde & E-Ordonnances Sécurisées**\n\n` +
        `• **Pharmacies de garde** : Consultez la liste géolocalisée des officines ouvertes la nuit et le week-end à Cotonou (Camp Guézo, Cadjèhoun, Akpakpa), Abomey-Calavi et Porto-Novo.\n` +
        `• **E-Ordonnance anti-fraude** : Chaque ordonnance émise par un médecin inscrit à l'Ordre National des Médecins du Bénin (ONMB) porte un **QR Code sécurisé** unique.\n` +
        `• **Délivrance** : Le pharmacien scanne le QR code pour valider la délivrance en temps réel, garantissant des médicaments authentiques certifiés par l'ABMed.`;

      return NextResponse.json<ChatResponsePayload>({
        reply: replyFr,
        severity: "normal",
        suggestedActions: [
          {
            label: "📍 Voir les Pharmacies de Garde",
            type: "link",
            target: "#pharmacies",
            variant: "primary"
          },
          {
            label: "📄 Mes E-Ordonnances",
            type: "link",
            target: "/dashboard#prescriptions",
            variant: "secondary"
          }
        ],
        quickReplies: [
          "Pharmacies de garde à Cotonou",
          "Comment scanner mon ordonnance ?",
          "Disponibilité de l'insuline et antipaludéens"
        ]
      });
    }

    // 6. Questions sur le Carnet Vaccinal (PEV Bénin)
    if (
      query.includes("vaccin") || 
      query.includes("pev") || 
      query.includes("bébé") || 
      query.includes("enfant") || 
      query.includes("bcg") || 
      query.includes("fièvre jaune")
    ) {
      const replyFr = 
        `👶 **Programme Élargi de Vaccination (PEV Bénin)**\n\n` +
        `Le calendrier vaccinal national obligatoire protège dès la naissance :\n\n` +
        `• **À la naissance** : BCG (Tuberculose) + Polio 0.\n` +
        `• **À 6, 10 et 14 semaines** : Pentavalent (Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib) + Pneumocoque + Rotavirus.\n` +
        `• **À 9 mois** : Fièvre Jaune (VAA) + Rougeole-Rubéole (RR1) + Méningite A.\n` +
        `• **Rappels** : Suivi décennal Tétanos pour les femmes en âge de procréer et adultes.\n\n` +
        `Votre carnet vaccinal numérique sur Care.bj garde la trace des numéros de lot et vous alerte par SMS pour les rappels.`;

      return NextResponse.json<ChatResponsePayload>({
        reply: replyFr,
        severity: "normal",
        suggestedActions: [
          {
            label: "💉 Voir mon Carnet Vaccinal",
            type: "link",
            target: "/dashboard#vaccines",
            variant: "primary"
          }
        ],
        quickReplies: [
          "Où faire vacciner mon enfant ?",
          "Rappel vaccin fièvre jaune",
          "Enregistrer un vaccin dans mon carnet"
        ]
      });
    }

    // 7. Questions en langue Fon ou salutations béninoises
    if (
      query.includes("fon") || 
      query.includes("kuabo") || 
      query.includes("kouabo") || 
      query.includes("a dɔ") || 
      query.includes("lanmɛ") || 
      lang === "fon"
    ) {
      const replyFon = 
        `🇧🇯 **Kouabo nǔ we ɖo Care.bj jí ! (Bienvenue)**\n\n` +
        `Un nyí alɔgɔ́tɔ́ towe nú lanmɛ na nɔ ganji tɔn. Nɛ̌ un ka sixu d'alɔ we gbɔn égbé ?\n\n` +
        `• **Asɔn alò agbaza zozo** : Un sixu d'alɔ we b'a na nya nǔ e a na bló é.\n` +
        `• **Dotóo mɔmɔ** : Sɔ́ azǎn e a jló na mɔ dotóo ɖo CNHU alò dotoxwé ɖevo mɛ.\n` +
        `• **Amasin xwé (Pharmacie)** : Mɔ amasin xwé e hún ɖo zànmɛ é.\n` +
        `• **SAMU 112** : Nú azɔn syɛnsyɛn ɖé jɛ jǐ towe ɔ, ylɔ 112 tlolo vɔvɔ.`;

      return NextResponse.json<ChatResponsePayload>({
        reply: replyFon,
        severity: "normal",
        suggestedActions: [
          {
            label: "📅 Prendre RDV / Sɔ́ azǎn nú dotóo",
            type: "link",
            target: "/dashboard#appointments",
            variant: "primary"
          },
          {
            label: "📞 Ylɔ SAMU Bénin (112)",
            type: "call",
            target: "tel:112",
            variant: "danger"
          }
        ],
        quickReplies: [
          "Lanmɛ che ma do gangji (Je ne me sens pas bien)",
          "Amasin xwé e hún égbé (Pharmacies ouvertes)",
          "Repasser en Français"
        ]
      });
    }

    // 8. Réponse d'orientation générale
    const generalReply = 
      `👋 **Bonjour ! Je suis CareBot, votre assistant santé souverain du Bénin.**\n\n` +
      `Je suis là pour vous accompagner 24h/24 et 7j/7 dans vos démarches de santé :\n\n` +
      `• **Triage des symptômes** : Expliquez-moi ce que vous ressentez (fièvre, toux, maux de tête, maux de ventre...).\n` +
      `• **Rendez-vous médicaux** : Réservez une consultation au CNHU ou une téléconsultation vidéo frugale.\n` +
      `• **Pharmacies de garde** : Localisez les officines ouvertes la nuit et vérifiez la conformité de vos ordonnances.\n` +
      `• **Carnet de santé ANIP & PEV** : Suivez vos vaccins, vos constantes (tension, glycémie) et votre profil d'urgence.\n\n` +
      `*Avertissement légal : Je suis un outil d'orientation et de triage. En cas d'urgence vitale, composez immédiatement le **112**.*`;

    return NextResponse.json<ChatResponsePayload>({
      reply: generalReply,
      severity: "normal",
      suggestedActions: [
        {
          label: "📅 Prendre un Rendez-vous",
          type: "link",
          target: "/dashboard#appointments",
          variant: "primary"
        },
        {
          label: "📍 Pharmacies de garde",
          type: "link",
          target: "#pharmacies",
          variant: "secondary"
        }
      ],
      quickReplies: [
        "J'ai de la fièvre et des courbatures",
        "Comment prendre un rendez-vous ?",
        "Où trouver une pharmacie de garde ?",
        "Parler en langue Fon 🇧🇯"
      ]
    });
  } catch (error) {
    console.error("Erreur assistant santé:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de votre demande." },
      { status: 500 }
    );
  }
}
