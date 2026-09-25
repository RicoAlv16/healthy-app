export type SupportedLang = 'fr' | 'fon' | 'yoruba' | 'bariba' | 'dendi';

export interface Translations {
  nav: {
    services: string;
    inclusion: string;
    pharmacies: string;
    specs: string;
    networkOnline: string;
    networkOffline: string;
    networkTooltipOnline: string;
    networkTooltipOffline: string;
    voiceBtn: string;
    loginBtn: string;
    title: string;
    subtitle: string;
  };
  emergency: {
    label: string;
    callBtn: string;
    locateBtn: string;
    alertSent: string;
    gpsLoc: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPatient: string;
    ctaVoice: string;
    metricCommunes: string;
    metricCommunesLabel: string;
    metricOffline: string;
    metricOfflineLabel: string;
    metricLangs: string;
    metricLangsLabel: string;
    metricFraud: string;
    metricFraudLabel: string;
    cardBadge: string;
    cardTitle: string;
    cardLastConsult: string;
    cardLastConsultVal: string;
    cardVaccine: string;
    cardVaccineVal: string;
    cardArch: string;
    cardArchVal: string;
    alertTitle: string;
    alertDesc: string;
    badgeOffline: string;
    badgeOfflineDesc: string;
  };
  ecosystem: {
    badge: string;
    title: string;
    subtitle: string;
    tabDmp: string;
    tabPharmacies: string;
    tabTeleexpertise: string;
    tabEpidemies: string;
    dmpBadge: string;
    dmpTitle: string;
    dmpDesc: string;
    bloodGroup: string;
    allergy: string;
    archCoverage: string;
    simulateScanBtn: string;
    downloadPassBtn: string;
    pharmacieTitle: string;
    pharmacieDesc: string;
    allCommunes: string;
    allMolecules: string;
    actStock: string;
    veninStock: string;
    insulineStock: string;
    inStock: string;
    outOfStock: string;
    onDutyBadge: string;
    teleexpertiseBadge: string;
    teleexpertiseTitle: string;
    teleexpertiseDesc: string;
    epidemieTitle: string;
    epidemieDesc: string;
  };
  inclusion: {
    badge: string;
    title: string;
    subtitle: string;
    p1Title: string;
    p1Desc: string;
    p1Action: string;
    p2Title: string;
    p2Desc: string;
    p2Badge: string;
    p3Title: string;
    p3Desc: string;
    p3Badge: string;
    p4Title: string;
    p4Desc: string;
    p4Badge: string;
  };
  footer: {
    desc: string;
    badgeSovereign: string;
    badgeLocalData: string;
    titleEmergency: string;
    samu: string;
    greenLine: string;
    firefighters: string;
    police: string;
    titleInstitutions: string;
    inst1: string;
    inst2: string;
    inst3: string;
    inst4: string;
    inst5: string;
    inst6: string;
    titleA11y: string;
    a11y1: string;
    a11y2: string;
    a11y3: string;
    a11y4: string;
    a11y5: string;
    copyright: string;
    passionBadge: string;
  };
}

export const translations: Record<SupportedLang, Translations> = {
  fr: {
    nav: {
      services: "Services",
      inclusion: "Inclusion & Langues",
      pharmacies: "Pharmacies",
      specs: "Spécifications",
      networkOnline: "Réseau",
      networkOffline: "Hors-ligne",
      networkTooltipOnline: "Réseau internet actif • Données synchronisées",
      networkTooltipOffline: "Mode hors-ligne • Données sécurisées sur l'appareil",
      voiceBtn: "Vocal",
      loginBtn: "Mon Espace",
      title: "Care.bj",
      subtitle: "Plateforme Nationale e-Santé"
    },
    emergency: {
      label: "URGENCE VITALE BÉNIN",
      callBtn: "Appeler SAMU (112)",
      locateBtn: "Centres d'Urgences & Réanimation",
      alertSent: "Alerte SOS transmise au centre de régulation SAMU le plus proche avec vos coordonnées GPS.",
      gpsLoc: "GPS: 6.3703° N, 2.4183° E (Cotonou)"
    },
    hero: {
      badge: "Challenge e-Santé Bénin • Plateforme Souveraine",
      title: "La santé pour chaque Béninoise et chaque Béninois, partout et sans barrière.",
      subtitle: "Une plateforme collaborative nationale reliant patients, soignants, pharmacies et hôpitaux. Conçue pour fonctionner même sans connexion internet et accessible dans nos langues nationales.",
      ctaPatient: "Accéder à mon Carnet de Santé",
      ctaVoice: "Écouter en Langue Nationale 🎙️",
      metricCommunes: "77",
      metricCommunesLabel: "Communes du Bénin",
      metricOffline: "100%",
      metricOfflineLabel: "Prêt Hors-Ligne (PWA)",
      metricLangs: "5",
      metricLangsLabel: "Langues Nationales",
      metricFraud: "0",
      metricFraudLabel: "Faux Médicament toléré",
      cardBadge: "Système National Sécurisé",
      cardTitle: "Carnet Santé Citoyen",
      cardLastConsult: "Dernière consultation :",
      cardLastConsultVal: "18 Sept. 2026 (CSA Ouidah)",
      cardVaccine: "Vaccin PEV :",
      cardVaccineVal: "Complet (Fièvre Jaune + VPI)",
      cardArch: "Prise en charge ARCH :",
      cardArchVal: "80% Couvert par l'État",
      alertTitle: "Campagne Saisonnière Paludisme",
      alertDesc: "Distribution gratuite de moustiquaires MILDA dans votre arrondissement.",
      badgeOffline: "Résilience 2G/3G",
      badgeOfflineDesc: "Zéro coupure en zone rurale"
    },
    ecosystem: {
      badge: "Écosystème Numérique Intégré",
      title: "Une plateforme qui relie l'ensemble des acteurs de santé",
      subtitle: "Explorez les modules fonctionnels conçus pour les patients, les soignants des zones rurales, les officines pharmaceutiques et les autorités sanitaires du Bénin.",
      tabDmp: "Dossier & QR Code",
      tabPharmacies: "Pharmacies & Stocks",
      tabTeleexpertise: "Téléexpertise Rurale",
      tabEpidemies: "Veille ANSSP / Ministère",
      dmpBadge: "Identité Sécurisée ANIP / NPI",
      dmpTitle: "Carte de Santé Numérique & Données Vitales Hors-Ligne",
      dmpDesc: "Chaque citoyen béninois dispose d'un profil médical souverain accessible via son NPI. En cas d'inconscience ou d'accident, les urgentistes peuvent scanner le QR code de la carte sans aucune connexion internet pour connaître le groupe sanguin et les allergies bloquantes.",
      bloodGroup: "Groupe Sanguin",
      allergy: "Allergie Vitale",
      archCoverage: "Assurance ARCH / AMU",
      simulateScanBtn: "Simuler le scan soignant (Mode Hors-Ligne)",
      downloadPassBtn: "Télécharger Passeport Vaccinal (PDF)",
      pharmacieTitle: "Pharmacies de Garde & Disponibilité des Médicaments d'Urgence",
      pharmacieDesc: "Trouvez en direct les officines ouvertes et vérifiez la présence des traitements vitaux.",
      allCommunes: "Toutes les communes",
      allMolecules: "Tous les médicaments",
      actStock: "Antipaludique ACT :",
      veninStock: "Sérum Antivenimeux :",
      insulineStock: "Insuline :",
      inStock: "En stock ✅",
      outOfStock: "Rupture ❌",
      onDutyBadge: "De Garde 🟢",
      teleexpertiseBadge: "Désenclavement Médical Rural",
      teleexpertiseTitle: "Téléexpertise Asynchrone (Store & Forward)",
      teleexpertiseDesc: "Un infirmier isolé dans un Centre de Santé d'Arrondissement (ex: Kérou, Karimama, Savalou) peut enregistrer les constantes, joindre une photo de lésion et une observation vocale. Le dossier se synchronise dès la reconnexion.",
      epidemieTitle: "Tableau de Bord Épidémiologique & Décisionnel (ANSSP / Ministère)",
      epidemieDesc: "Surveillance active des foyers infectieux à notification obligatoire sur les 12 départements du Bénin."
    },
    inclusion: {
      badge: "Critère Fondamental du Challenge",
      title: "Une plateforme totalement inclusive, sans exclusion",
      subtitle: "Conçue pour être manipulée avec aisance par une mère de famille en milieu rural ne sachant pas lire, un patient malvoyant ou une personne sourde.",
      p1Title: "Vocal & Langues Locales",
      p1Desc: "Toutes les explications, rappels de vaccins et ordonnances peuvent être écoutés en Fon, Yoruba, Bariba, Dendi et Français d'un simple tap tactile.",
      p1Action: "Tester le guidage vocal →",
      p2Title: "Déficience Visuelle",
      p2Desc: "Rapport de contraste supérieur à 7:1, mode sombre ambré, compatibilité TalkBack/VoiceOver et grossissement de police jusqu'à 130%.",
      p2Badge: "Norme WCAG 2.1 AAA",
      p3Title: "Déficience Auditive",
      p3Desc: "Sous-titres textuels automatiques pour toute consigne vocale, signaux visuels clignotants et intégration de la Langue des Signes Béninoise (LSB).",
      p3Badge: "Alertes visuelles & LSB",
      p4Title: "Connectivité Faible / 2G",
      p4Desc: "Architecture Offline-First (PWA). Poids initial < 150 Ko. Les consultations saisies en zone rurale sont synchronisées dès le retour du réseau.",
      p4Badge: "IndexedDB + Service Worker"
    },
    footer: {
      desc: "Plateforme numérique souveraine, collaborative et universellement accessible de suivi des soins en République du Bénin.",
      badgeSovereign: "Souveraineté Numérique Bénin",
      badgeLocalData: "Données hébergées localement",
      titleEmergency: "Urgences Bénin",
      samu: "🚨 SAMU National : 112",
      greenLine: "📞 Ligne Verte Santé : 136",
      firefighters: "🚒 Sapeurs-Pompiers : 118",
      police: "👮 Police Républicaine : 117",
      titleInstitutions: "Institutions & Agences",
      inst1: "Ministère de la Santé du Bénin",
      inst2: "ASIN (Systèmes d'Information)",
      inst3: "ANSSP (Soins Primaires)",
      inst4: "ANIP (Identité Citoyenne - NPI)",
      inst5: "Projet ARCH / Assurance Santé",
      inst6: "ABMed (Agence du Médicament)",
      titleA11y: "Accessibilité & APDP",
      a11y1: "Conforme WCAG 2.1 niveau AAA",
      a11y2: "Synthèse vocale 4 langues béninoises",
      a11y3: "Mode Hors-Ligne (Offline-First)",
      a11y4: "Conforme Code du Numérique (APDP)",
      a11y5: "Secret Médical & Chiffrement AES-256",
      copyright: "© 2026 Care.bj • Développé dans le cadre du Challenge e-Santé Bénin.",
      passionBadge: "Fait avec passion pour le système de santé du Bénin"
    }
  },

  fon: {
    nav: {
      services: "Azɔ̌ lɛ",
      inclusion: "Alafia Bǐ",
      pharmacies: "Amasinxwé",
      specs: "Wema lɛ",
      networkOnline: "Ɛntɛnɛti ɖò jí",
      networkOffline: "Fífá (Offline)",
      networkTooltipOnline: "Ɛntɛnɛti ɖò azɔ̌jí • Wɛn lɛ ɖò kplékplé wɛ",
      networkTooltipOffline: "Ɛntɛnɛti mɛvo • Wema towe lɛ ɖò mɔ̌to towe jí",
      voiceBtn: "Gbeɖiɖó",
      loginBtn: "Byɔ Mɛ",
      title: "Care.bj",
      subtitle: "Alafia tò ɔ bǐ tɔn"
    },
    emergency: {
      label: "AZAN GBLÉGBÉ TƆN (URGENCE)",
      callBtn: "Ylɔ SAMU (112)",
      locateBtn: "Dotoxwé ɖaxó e sɛkpɔ we lɛ",
      alertSent: "Wɛn gblégblé yí doto lɛ gɔ́n kpo fi e a ɖè e kpo.",
      gpsLoc: "GPS: 6.3703° N, 2.4183° E (Kútɔ́nu)"
    },
    hero: {
      badge: "Challenge e-Santé Bénin • Tò mǐtɔn tɔn",
      title: "Gbɛzán ɖagbe nú tòvi lɛ bǐ, ɖò tò ɔ bǐ mɛ abɔ mɛɖé ma jɛ gudo.",
      subtitle: "Azɔ̌wanú e d'alɔ dotóxó lɛ bǐ, bɔ e sixú zán gbɔn amasin-zɔ́watɔ́ lɛ kpo tòvi lɛ kpo tɛntin, kaka yi zungbó mɛ kpo fífá kpo.",
      ctaPatient: "Kpɔ́n wema cè dotoxwé tɔn",
      ctaVoice: "Sè xó ɖò Fɔ̀ngbè mɛ 🎙️",
      metricCommunes: "77",
      metricCommunesLabel: "Kominu Bénin tɔn lɛ",
      metricOffline: "100%",
      metricOfflineLabel: "Ɛntɛnɛti ma ɖò gbɔn",
      metricLangs: "5",
      metricLangsLabel: "Gbè mǐtɔn lɛ",
      metricFraud: "0",
      metricFraudLabel: "Amasin nyanya ɖebǔ mɛvo",
      cardBadge: "Dotoxwé tò ɔ tɔn cɔ́",
      cardTitle: "Wema dotoxwé tòvi tɔn",
      cardLastConsult: "Azǎn gudo tɔn :",
      cardLastConsultVal: "18 Sept. 2026 (CSA Xweda)",
      cardVaccine: "Gbɛ́nɔ́gán :",
      cardVaccineVal: "E bǐ sɔ́ fó (Fièvre Jaune + VPI)",
      cardArch: "ARCH alɔdó :",
      cardArchVal: "80% Tò ɔ wɛ na sú",
      alertTitle: "Asunwanú Paludisme tɔn",
      alertDesc: "Moustiquaire vɔ̌nu ɖò kɔmɛ towe mɛ.",
      badgeOffline: "2G/3G Azɔ̌wanú",
      badgeOfflineDesc: "E ma na nɔte kpɔ́n gbeɖé ǎ"
    },
    ecosystem: {
      badge: "Azɔ̌wanú kpɔ́ tɔn",
      title: "Azɔ̌wanú e kplé dotoxwé, amasin kpo tòvi lɛ kpo bǐ",
      subtitle: "Kpɔ́n tɛn vovo e e bló nú azɔn-nɔ lɛ, doto zungbó mɛ tɔn lɛ, kpo amasin-satɔ́ lɛ kpo.",
      tabDmp: "Wema & QR",
      tabPharmacies: "Amasinxwé lɛ",
      tabTeleexpertise: "Doto zɔntɔ",
      tabEpidemies: "Gǎnhɔnyitɔ́ tɛn",
      dmpBadge: "ANIP / NPI Wuntun",
      dmpTitle: "Wema alafia tɔn e ɖò kanji ma ɖó ɛntɛnɛti é",
      dmpDesc: "Mɛ bǐ wɛ ɖó wema kpo NPI kpo. Enyi afɔkú ɖé jɛ ɔ, doto lɛ na kpɔ́n QR code ɔ kpo hun towe kpo gbɔn fífá mɛ.",
      bloodGroup: "Hun towe",
      allergy: "Amasin e ma jɛxa we ǎ",
      archCoverage: "ARCH / AMU Gǎn",
      simulateScanBtn: "Tɛ́n scan kpɔ́n (Ɛntɛnɛti mɛvo)",
      downloadPassBtn: "Sɔ́ wema gbɛ́nɔ́gán tɔn (PDF)",
      pharmacieTitle: "Amasinxwé e hùn zánjí lɛ kpo amasin taji lɛ kpo",
      pharmacieDesc: "Mɔ amasinxwé e sɛkpɔ we bɔ amasin ɖò finɛ é.",
      allCommunes: "Kominu lɛ bǐ",
      allMolecules: "Amasin lɛ bǐ",
      actStock: "Amasin Asobá tɔn :",
      veninStock: "Dan ɖu amasin :",
      insulineStock: "Insuline :",
      inStock: "E ɖò finɛ ✅",
      outOfStock: "E vɔ̀ ❌",
      onDutyBadge: "Hùn Zánjí 🟢",
      teleexpertiseBadge: "Zungbó mɛ alɔdó",
      teleexpertiseTitle: "Doto zɔntɔ e nɔ sɛ́ wɛn dó CNHU é",
      teleexpertiseDesc: "Doto e ɖò Kérou abǐ Tori ɔ sixú sɛ́ fɔto kpo gbeɖiɖó kpo dó doto ɖaxó Kútɔ́nu tɔn lɛ.",
      epidemieTitle: "Azɔn gblégblé cɔtɔ́ tɛn (ANSSP / Ministère)",
      epidemieDesc: "Kpɔ́n lee azɔn lɛ ɖò dindin gbɔn ɖò tò ɔ mɛ é."
    },
    inclusion: {
      badge: "Taji bǐ Challenge tɔn",
      title: "Mɛ bǐ wɛ na zán, mɛɖé ma jɛ gudo",
      subtitle: "Nɔvi nyɔnu e ma yi wemaxwé ǎ, nukun-tɔ́ kpo tókpónɔ kpo bǐ wɛ sixú zán.",
      p1Title: "Gbeɖiɖó kpo Gbè mǐtɔn lɛ kpo",
      p1Desc: "Sè wɛn lɛ bǐ ɖò Fɔ̀ngbè, Yorùbá, Baatonum, Dendi kpo Flanségbe kpo mɛ.",
      p1Action: "Tɛ́n gbeɖiɖó kpɔ́n →",
      p2Title: "Nukun ma mɔ nù ganji",
      p2Desc: "Wuntun klókló lɛ, nù e na zɔ́n bɔ nukun na mɔ nù fífá mɛ é.",
      p2Badge: "WCAG 2.1 AAA Gǎn",
      p3Title: "Tó ma sè xó ganji",
      p3Desc: "Wema ɖò glɔ́ nú xó lɛ bǐ kpo alɔkpa e nɔ d'alɔ tókpónɔ lɛ é (LSB).",
      p3Badge: "Alɔ-wuntun kpo LSB kpo",
      p4Title: "Ɛntɛnɛti fífá (2G/3G)",
      p4Desc: "E nɔ w'azɔ̌ bǐ etlɛ nyí ɛntɛnɛti kpo wɛ ɔ, e na kplé wɛn lɛ bǐ hwenu e e lùn é.",
      p4Badge: "IndexedDB + Fífá"
    },
    footer: {
      desc: "Azɔ̌wanú e kplé tò ɔ bǐ kpo alafia tòvi lɛ tɔn kpo ɖò Bénin.",
      badgeSovereign: "Tò Bénin tɔn tɔn",
      badgeLocalData: "Wɛn lɛ ɖò tò ɔ mɛ",
      titleEmergency: "Afɔkú Bénin",
      samu: "🚨 SAMU Tò tɔn : 112",
      greenLine: "📞 Kán Fífá Alafia : 136",
      firefighters: "🚒 Zǒcɔtɔ́ lɛ : 118",
      police: "👮 Kpóntɔ́ lɛ : 117",
      titleInstitutions: "Gǎnhɔnyitɔ́ tɛn lɛ",
      inst1: "Ministère Alafia tɔn",
      inst2: "ASIN (Ɛntɛnɛti gǎn)",
      inst3: "ANSSP (Alafia bibi)",
      inst4: "ANIP (NPI wema)",
      inst5: "ARCH Alɔdó",
      inst6: "ABMed (Amasin gǎn)",
      titleA11y: "Mɛ bǐ tɔn & APDP",
      a11y1: "WCAG 2.1 AAA nùbǐ",
      a11y2: "Gbeɖiɖó gbè 4 mɛ",
      a11y3: "Ɛntɛnɛti mɛvo (Offline)",
      a11y4: "APDP Séwéma tɔn",
      a11y5: "Cɔ́cɔ́ kpo AES-256 kpo",
      copyright: "© 2026 Care.bj • Challenge e-Santé Bénin.",
      passionBadge: "Bló kpo wanyiyi kpo nú Bénin"
    }
  },

  yoruba: {
    nav: {
      services: "Àwọn Iṣẹ́",
      inclusion: "Ìrànlọ́wọ́",
      pharmacies: "Egbòogi",
      specs: "Àkọsílẹ̀",
      networkOnline: "Nẹ́tíwọ́ọ̀kì wà",
      networkOffline: "Láìsí Nẹ́tíwọ́ọ̀kì",
      networkTooltipOnline: "Intanẹ́ẹ̀tì ń ṣiṣẹ́ • Àwọn iṣẹ́ wà lójúkannáà",
      networkTooltipOffline: "Láìsí intanẹ́ẹ̀tì • Àwọn iṣẹ́ wà lórí ẹ̀rọ",
      voiceBtn: "Ohùn",
      loginBtn: "Wọlé",
      title: "Care.bj",
      subtitle: "Ìlera fún Gbogbo Wa"
    },
    emergency: {
      label: "PÀJÁWÌRÌ ÌLERA (URGENCE)",
      callBtn: "Pè SAMU (112)",
      locateBtn: "Ilé-ìwòsàn tó súnmọ́ jùlọ",
      alertSent: "A ti fi ifitonileti pajawiri ranṣẹ si ile-iwosan to sunmọ ọ.",
      gpsLoc: "GPS: 6.3703° N, 2.4183° E (Kútɔ́nu)"
    },
    hero: {
      badge: "Challenge e-Santé Bénin • Orílẹ̀-èdè Wa",
      title: "Ìlera fún gbogbo ọmọ orílẹ̀-èdè Benin, ní gbogbo ibi láìsí ìdènà.",
      subtitle: "Ètò ìgbàlódé láti so àwọn aláìsàn, oníṣègùn àti ilé-ìwòsàn pọ̀, tó ń ṣiṣẹ́ láìsí intanẹ́ẹ̀tì àti ní èdè wa.",
      ctaPatient: "Wo àkọsílẹ̀ ìlera mi",
      ctaVoice: "Gbọ́ ní Yorùbá 🎙️",
      metricCommunes: "77",
      metricCommunesLabel: "Àwọn Ìjọba Ìbílẹ̀",
      metricOffline: "100%",
      metricOfflineLabel: "Láìsí Intanẹ́ẹ̀tì",
      metricLangs: "5",
      metricLangsLabel: "Àwọn Èdè Wa",
      metricFraud: "0",
      metricFraudLabel: "Oògùn Èké Kankan",
      cardBadge: "Ààbò Orílẹ̀-èdè",
      cardTitle: "Àkọsílẹ̀ Ìlera Ara Ẹni",
      cardLastConsult: "Ìbẹ̀wò tó kẹ́yìn :",
      cardLastConsultVal: "18 Sept. 2026 (CSA Ouidah)",
      cardVaccine: "Àjẹsára PEV :",
      cardVaccineVal: "Pé pérépéré (Iba Pupa + VPI)",
      cardArch: "Ìrànlọ́wọ́ ARCH :",
      cardArchVal: "80% Ìjọba ló san án",
      alertTitle: "Igbega Lodi si Iba",
      alertDesc: "Pínpín àwọ̀n ẹ̀fọn lọ́fẹ̀ẹ́ ní àdúgbò rẹ.",
      badgeOffline: "2G/3G Ń Ṣiṣẹ́",
      badgeOfflineDesc: "Kò ní dánu dúró rárá"
    },
    ecosystem: {
      badge: "Ètò Tó So Gbogbo Pọ̀",
      title: "Ètò tó so gbogbo àwọn oníṣègùn àti aláìsàn pọ̀",
      subtitle: "Ṣàwárí àwọn ẹ̀ka fún àwọn aláìsàn, àwọn oníṣègùn abúlé, àti ilé-iṣẹ́ egbòogi.",
      tabDmp: "Àkọsílẹ̀ & QR",
      tabPharmacies: "Ilé Egbòogi",
      tabTeleexpertise: "Ìwòsàn Òkèèrè",
      tabEpidemies: "Ilé-iṣẹ́ Ìjọba",
      dmpBadge: "ANIP / NPI Ìdánimọ̀",
      dmpTitle: "Káàdì Ìlera Àti Ìwífún Láìsí Intanẹ́ẹ̀tì",
      dmpDesc: "Gbogbo ọmọ orílẹ̀-èdè ló ní àkọsílẹ̀ pẹ̀lú NPI. Tí nǹkan pajawiri bá ṣẹlẹ̀, àwọn dọ́kítà lè ṣe àyẹ̀wò QR láìsí nẹ́tíwọ́ọ̀kì.",
      bloodGroup: "Ẹ̀jẹ̀ Rẹ",
      allergy: "Egbòogi Tó Lè Pa Ọ́ Lára",
      archCoverage: "ARCH / AMU Ìlera",
      simulateScanBtn: "Dán àyẹ̀wò wò (Láìsí Nẹ́tíwọ́ọ̀kì)",
      downloadPassBtn: "Gba Ìwé Àjẹsára (PDF)",
      pharmacieTitle: "Àwọn Ilé Egbòogi Tó Wà Lálẹ́ Àti Àwọn Oògùn Pàtàkì",
      pharmacieDesc: "Wá ilé egbòogi tó wà ní ṣíṣí àti àwọn oògùn tó wà lárọ̀ọ́wọ́tó.",
      allCommunes: "Gbogbo Ìlú",
      allMolecules: "Gbogbo Oògùn",
      actStock: "Oògùn Ibà :",
      veninStock: "Oró Ejò :",
      insulineStock: "Insulini :",
      inStock: "Ó wà nílẹ̀ ✅",
      outOfStock: "Kò sí mọ́ ❌",
      onDutyBadge: "Wà Lálẹ́ 🟢",
      teleexpertiseBadge: "Ìrànlọ́wọ́ sí Abúlé",
      teleexpertiseTitle: "Ìbánisọ̀rọ̀ Oníṣègùn sí CNHU",
      teleexpertiseDesc: "Oníṣègùn tó wà ní abúlé lè fi àwòrán àti ohùn ránṣẹ́ sí àwọn ọ̀jọ̀gbọ́n ní Kútɔ́nu.",
      epidemieTitle: "Àtẹ Àkíyèsí Àrùn (ANSSP / Ministère)",
      epidemieDesc: "Àkíyèsí lórí bí àwọn àrùn ṣe ń tàn káàkiri orílẹ̀-èdè."
    },
    inclusion: {
      badge: "Kókó Pàtàkì fún Ìdíje",
      title: "Ètò fún gbogbo ènìyàn, láìsí ẹnìkan lẹ́yìn",
      subtitle: "Fún àwọn tí kò mọ̀ọ́kọ-mọ̀ọ́kà, àwọn afọ́jú tàbí adití.",
      p1Title: "Ohùn & Àwọn Èdè Wa",
      p1Desc: "Gbọ́ àlàyé ní Fon, Yoruba, Bariba, Dendi àti Faranse nípa títẹ kọ̀ǹpútà rẹ lásán.",
      p1Action: "Dán ohùn wò →",
      p2Title: "Àwọn Aláìríran",
      p2Desc: "Àwọn lẹ́tà títóbi àti ìṣètò tó jẹ́ kí àwọn afọ́jú gbọ́ ohun tó wà lórí ẹ̀rọ.",
      p2Badge: "WCAG 2.1 AAA",
      p3Title: "Àwọn Adití",
      p3Desc: "Àwọn àkọsílẹ̀ lórí fídíò àti Èdè Àwọn Adití ní Benin (LSB).",
      p3Badge: "LSB & Àkọsílẹ̀",
      p4Title: "Nẹ́tíwọ́ọ̀kì Kékeré (2G/3G)",
      p4Desc: "Ẹ̀rọ náà ń ṣiṣẹ́ bó tiẹ̀ jẹ́ pé kò sí intanẹ́ẹ̀tì, yóò sì gba iṣẹ́ pamọ́ sí orí ẹ̀rọ.",
      p4Badge: "IndexedDB + Offline"
    },
    footer: {
      desc: "Ètò ìgbàlódé fún ìlera gbogbo àwọn ará Benin.",
      badgeSovereign: "Ti Orílẹ̀-èdè Benin",
      badgeLocalData: "Àwọn ìwífún wà nílé",
      titleEmergency: "Pàjáwìrì Benin",
      samu: "🚨 SAMU Orílẹ̀-èdè : 112",
      greenLine: "📞 Ìlà Ìlera Ọ̀fẹ́ : 136",
      firefighters: "🚒 Àwọn Olùpaná : 118",
      police: "👮 Ọlọ́pàá : 117",
      titleInstitutions: "Àwọn Ilé-iṣẹ́ Ìjọba",
      inst1: "Ilé-iṣẹ́ Ìlera Benin",
      inst2: "ASIN (Ẹ̀rọ Ayélujára)",
      inst3: "ANSSP (Ìlera Àkọ́kọ́)",
      inst4: "ANIP (NPI Ìdánimọ̀)",
      inst5: "Ètò ARCH",
      inst6: "ABMed (Egbòogi)",
      titleA11y: "Àyè fún Gbogbo & APDP",
      a11y1: "WCAG 2.1 AAA",
      a11y2: "Ohùn ní èdè mẹ́rin",
      a11y3: "Láìsí Intanẹ́ẹ̀tì",
      a11y4: "Òfin APDP",
      a11y5: "Ààbò AES-256",
      copyright: "© 2026 Care.bj • Challenge e-Santé Bénin.",
      passionBadge: "Pẹ̀lú ìfẹ́ fún Benin"
    }
  },

  bariba: {
    nav: {
      services: "Kɔ̃ɔ̃ yeru",
      inclusion: "Alafia",
      pharmacies: "Dɔkɔtɔ",
      specs: "Wema",
      networkOnline: "Intanɛti wãã",
      networkOffline: "Sɔɔ gobi",
      networkTooltipOnline: "Intanɛti ya wãã",
      networkTooltipOffline: "Intanɛti kuro sɔɔ",
      voiceBtn: "Gɔbisi",
      loginBtn: "Dùra",
      title: "Care.bj",
      subtitle: "Alafia bɛɛ kɔbɔ kuro"
    },
    emergency: {
      label: "TƆKƆ SAA GOBI (URGENCE)",
      callBtn: "Kɔkɔ SAMU (112)",
      locateBtn: "Boru dɔkɔtɔ kɔmbusi",
      alertSent: "A ti gba ifitonileti pajawiri rẹ.",
      gpsLoc: "GPS: 6.3703° N, 2.4183° E (Kútɔ́nu)"
    },
    hero: {
      badge: "Challenge e-Santé Bénin • Tò mǐtɔn tɔn",
      title: "Bɛɛ kɔbɔ alafia wura kɔmbusi, dɔkɔtɔ kuro ka nɔɔ.",
      subtitle: "A koo kpĩ a dɔkɔtɔ kɔmbusi wa, teeru baa nɔɔ kpɛɛkuru.",
      ctaPatient: "Kɔkɔ alafia wura",
      ctaVoice: "Nɛɛra sɔɔ 🎙️",
      metricCommunes: "77",
      metricCommunesLabel: "Kominu Bénin tɔn lɛ",
      metricOffline: "100%",
      metricOfflineLabel: "Saa gberu",
      metricLangs: "5",
      metricLangsLabel: "Kɔ̃ɔ̃ kuro",
      metricFraud: "0",
      metricFraudLabel: "Dɔkɔtɔ kuro",
      cardBadge: "Boru dɔkɔtɔ kɔmbusi",
      cardTitle: "Alafia wura",
      cardLastConsult: "Dɔkɔtɔ kuro :",
      cardLastConsultVal: "18 Sept. 2026 (CSA Savalou)",
      cardVaccine: "PEV gberu :",
      cardVaccineVal: "Fièvre Jaune + VPI",
      cardArch: "ARCH kuro :",
      cardArchVal: "80% Tò ɔ",
      alertTitle: "Paludisme kɔmbusi",
      alertDesc: "Moustiquaire vɔ̌nu kɔmbusi.",
      badgeOffline: "2G/3G kuro",
      badgeOfflineDesc: "Saa kuro"
    },
    ecosystem: {
      badge: "Boru dɔkɔtɔ kɔmbusi",
      title: "Kɔ̃ɔ̃ yeru ka dɔkɔtɔ kɔmbusi kuro",
      subtitle: "Alafia wura kuro ka kominu kuro.",
      tabDmp: "Wema & QR",
      tabPharmacies: "Dɔkɔtɔ",
      tabTeleexpertise: "Teeru",
      tabEpidemies: "Gberu",
      dmpBadge: "ANIP / NPI",
      dmpTitle: "Káàdì Alafia tɔn",
      dmpDesc: "Bɛɛ kɔbɔ alafia wura kɔmbusi.",
      bloodGroup: "Yem",
      allergy: "Allergie",
      archCoverage: "ARCH / AMU",
      simulateScanBtn: "Dán scan wò",
      downloadPassBtn: "Gba PDF",
      pharmacieTitle: "Dɔkɔtɔ kɔmbusi",
      pharmacieDesc: "A koo kpĩ a dɔkɔtɔ wa.",
      allCommunes: "Kominu",
      allMolecules: "Dɔkɔtɔ",
      actStock: "ACT :",
      veninStock: "Sérum :",
      insulineStock: "Insuline :",
      inStock: "Ya wãã ✅",
      outOfStock: "Kò sí ❌",
      onDutyBadge: "Wãã 🟢",
      teleexpertiseBadge: "Zungbó",
      teleexpertiseTitle: "CNHU kɔmbusi",
      teleexpertiseDesc: "Teeru baa nɔɔ.",
      epidemieTitle: "ANSSP Ministère",
      epidemieDesc: "Alafia wura."
    },
    inclusion: {
      badge: "Challenge",
      title: "Alafia fún gbogbo",
      subtitle: "Nɛɛra sɔɔ.",
      p1Title: "Gɔbisi teeru",
      p1Desc: "Sè wɛn lɛ bǐ.",
      p1Action: "Dán wò →",
      p2Title: "Nukun",
      p2Desc: "WCAG AAA.",
      p2Badge: "AAA",
      p3Title: "Tó",
      p3Desc: "LSB.",
      p3Badge: "LSB",
      p4Title: "2G/3G",
      p4Desc: "Offline-First.",
      p4Badge: "PWA"
    },
    footer: {
      desc: "Alafia bɛɛ kɔbɔ kuro Bénin sɔɔ.",
      badgeSovereign: "Bénin wura",
      badgeLocalData: "Wema wãã",
      titleEmergency: "Gobi Bénin",
      samu: "🚨 SAMU : 112",
      greenLine: "📞 Alafia : 136",
      firefighters: "🚒 Sapeurs : 118",
      police: "👮 Police : 117",
      titleInstitutions: "Institutions",
      inst1: "Ministère Alafia",
      inst2: "ASIN",
      inst3: "ANSSP",
      inst4: "ANIP",
      inst5: "ARCH",
      inst6: "ABMed",
      titleA11y: "Alafia & APDP",
      a11y1: "WCAG 2.1 AAA",
      a11y2: "Gɔbisi 4",
      a11y3: "Offline",
      a11y4: "APDP",
      a11y5: "AES-256",
      copyright: "© 2026 Care.bj • Challenge e-Santé Bénin.",
      passionBadge: "Bénin wura"
    }
  },

  dendi: {
    nav: {
      services: "Goyey",
      inclusion: "Baani",
      pharmacies: "Safaree",
      specs: "Tirey",
      networkOnline: "Internet ga goy",
      networkOffline: "Internet si",
      networkTooltipOnline: "Internet a ga goy",
      networkTooltipOffline: "Internet a si no",
      voiceBtn: "Jinde",
      loginBtn: "Hundu",
      title: "Care.bj",
      subtitle: "Baani borey kul se"
    },
    emergency: {
      label: "CAWARI MAALEY (URGENCE)",
      callBtn: "Cee SAMU (112)",
      locateBtn: "Lokotoroo ka kani",
      alertSent: "I cawari koy lokotoro jine.",
      gpsLoc: "GPS: 6.3703° N, 2.4183° E (Kútɔ́nu)"
    },
    hero: {
      badge: "Challenge e-Santé Bénin • Baani",
      title: "Baani nda baani cawari borey kul se Benin ra.",
      subtitle: "Platforme ka ga lokotoro nda borey margu, ba internet si no a ga goy.",
      ctaPatient: "Di ay baani tire",
      ctaVoice: "Hanga ciine 🎙️",
      metricCommunes: "77",
      metricCommunesLabel: "Communes Benin ra",
      metricOffline: "100%",
      metricOfflineLabel: "Internet si",
      metricLangs: "5",
      metricLangsLabel: "Ciiney",
      metricFraud: "0",
      metricFraudLabel: "Safaree laalo si",
      cardBadge: "Baani hugu goy",
      cardTitle: "Baani tire",
      cardLastConsult: "Lokotoro di koro :",
      cardLastConsultVal: "18 Sept. 2026 (CSA Malanville)",
      cardVaccine: "Vaccin PEV :",
      cardVaccineVal: "Fièvre Jaune + VPI",
      cardArch: "ARCH gaa :",
      cardArchVal: "80% Laabo no",
      alertTitle: "Paludisme goy",
      alertDesc: "Moustiquaire faaba.",
      badgeOffline: "2G/3G goy",
      badgeOfflineDesc: "A si kay"
    },
    ecosystem: {
      badge: "Margu platforme",
      title: "Platforme ka ga baani borey margu",
      subtitle: "Di lokotoro hugu nda safaree hugu.",
      tabDmp: "Tira & QR",
      tabPharmacies: "Safaree",
      tabTeleexpertise: "Teeru",
      tabEpidemies: "Laabo",
      dmpBadge: "ANIP / NPI",
      dmpTitle: "Baani tire ka internet si ra",
      dmpDesc: "Borey kul gonda NPI.",
      bloodGroup: "Kuri",
      allergy: "Allergie",
      archCoverage: "ARCH / AMU",
      simulateScanBtn: "Dán scan wò",
      downloadPassBtn: "Gba PDF",
      pharmacieTitle: "Safaree hugu ka kani",
      pharmacieDesc: "Di safaree ka goy.",
      allCommunes: "Communes",
      allMolecules: "Safarey",
      actStock: "ACT :",
      veninStock: "Sérum :",
      insulineStock: "Insuline :",
      inStock: "A no ✅",
      outOfStock: "A si no ❌",
      onDutyBadge: "A ga goy 🟢",
      teleexpertiseBadge: "Zungbó",
      teleexpertiseTitle: "CNHU Cotonou",
      teleexpertiseDesc: "Hanga ciine.",
      epidemieTitle: "ANSSP Ministère",
      epidemieDesc: "Baani goy."
    },
    inclusion: {
      badge: "Challenge",
      title: "Baani borey kul se",
      subtitle: "Hanga ciine.",
      p1Title: "Jinde ciine",
      p1Desc: "Sè wɛn lɛ bǐ.",
      p1Action: "Dán wò →",
      p2Title: "Moo",
      p2Desc: "WCAG AAA.",
      p2Badge: "AAA",
      p3Title: "Hanga",
      p3Desc: "LSB.",
      p3Badge: "LSB",
      p4Title: "2G/3G",
      p4Desc: "Offline-First.",
      p4Badge: "PWA"
    },
    footer: {
      desc: "Baani nda alafia platforme Benin ra.",
      badgeSovereign: "Benin Laabo",
      badgeLocalData: "Tirey wãã",
      titleEmergency: "Cawari Benin",
      samu: "🚨 SAMU : 112",
      greenLine: "📞 Baani : 136",
      firefighters: "🚒 Pompiers : 118",
      police: "👮 Police : 117",
      titleInstitutions: "Institutions",
      inst1: "Ministère Baani",
      inst2: "ASIN",
      inst3: "ANSSP",
      inst4: "ANIP",
      inst5: "ARCH",
      inst6: "ABMed",
      titleA11y: "Baani & APDP",
      a11y1: "WCAG 2.1 AAA",
      a11y2: "Jinde ciiney",
      a11y3: "Offline",
      a11y4: "APDP",
      a11y5: "AES-256",
      copyright: "© 2026 Care.bj • Challenge e-Santé Bénin.",
      passionBadge: "Benin Laabo"
    }
  }
};
