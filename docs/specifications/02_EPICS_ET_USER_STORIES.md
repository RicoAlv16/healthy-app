# SPÉCIFICATIONS FONCTIONNELLES : EPICS & USER STORIES
## Plateforme e-Santé Bénin (Care.bj)

---

## SOMMAIRE DES EPICS

1. **EPIC-01 : Authentification, Identité Citoyenne (NPI/ANIP) & Gestion des Accès**
2. **EPIC-02 : Dossier Médical Partagé (DMP) & Carnet de Santé Numérique**
3. **EPIC-03 : Prise de Rendez-vous, Télémédecine & Téléexpertise Frugale**
4. **EPIC-04 : e-Prescription, Pharmacies & Traçabilité des Médicaments**
5. **EPIC-05 : Inclusion Forte, Accessibilité WCAG AAA & Vocal en Langues Nationales**
6. **EPIC-06 : Résilience Hors-Ligne (Offline-First) & Bas Débit**
7. **EPIC-07 : Urgences Médicales, SAMU & Registre des Lits Disponibles**
8. **EPIC-08 : Tiers-Payant, Intégration AMU/ARCH & Paiement Mobile Money**
9. **EPIC-09 : Veille Épidémiologique & Pilotage Sanitaire (Ministère / ANSSP)**
10. **EPIC-10 : Innovations, Triage Assisté par IA Frugale & Assistant Santé Omnicanal**

---

## DÉTAIL DES EPICS & USER STORIES

```
Convention de notation :
- US-XXX : Identifiant unique de la User Story
- Rôle : Acteur ciblé (Patient, Médecin, Infirmier, Pharmacien, etc.)
- Priorité : MUST / SHOULD / COULD / WON'T
- Estimation : Story Points (SP) selon l'échelle de Fibonacci (1, 2, 3, 5, 8, 13)
```

---

### EPIC-01 : Authentification, Identité Citoyenne (NPI/ANIP) & Gestion des Accès

#### Objectif
Garantir une identification certaine, sécurisée et inclusive de tous les citoyens et praticiens béninois, sans exclusion des populations dépourvues de documents d'identité formels.

---

#### US-01.1 : Connexion et Authentification Sécurisée par NPI / Téléphone
* **En tant que** citoyen béninois,  
  **je souhaite** me connecter à la plateforme en renseignant mon Numéro Personnel d'Identification (NPI) ou mon numéro de téléphone local (MTN, Moov, Celtiis),  
  **afin d'** accéder simplement et en toute sécurité à mon espace santé personnel.
* **Critères d'acceptation (Gherkin) :**
  ```gherkin
  Scénario: Connexion réussie via OTP SMS
    Étant donné que je suis sur la page de connexion
    Quand je saisis mon numéro de téléphone béninois valide (+229 97XX XXXX)
    Et que je clique sur "Recevoir mon code d'accès"
    Alors le système m'envoie un code OTP à 6 chiffres par SMS valable 5 minutes
    Et quand je saisis le code exact
    Alors je suis redirigé vers mon tableau de bord santé personnalisé.

  Scénario: Numéro invalide ou non reconnu
    Quand je saisis un format de numéro erroné
    Alors un message d'erreur clair et vocalement énoncé m'indique le format attendu.
  ```
* **Priorité :** MUST  
* **Points d'effort :** 5 SP  
* **Dépendances :** Passerelle SMS béninoise / API ANIP.

---

#### US-01.2 : Enrôlement Médical d'Urgence et Profil Dégradé (Mode Sans Papiers)
* **En tant qu'** agent de santé / infirmier d'accueil,  
  **je souhaite** créer un dossier provisoire d'urgence pour un patient inconscient ou sans identifiant officiel (prise d'une photo et d'un identifiant généré aléatoirement),  
  **afin de** prodiguer les soins immédiats sans blocage administratif.
* **Critères d'acceptation :**
  * Le système permet la création d'un profil "Patient d'Urgence" en moins de 30 secondes.
  * Seuls les champs vitaux sont obligatoires : Sexe estimé, Âge approximatif, Photo du visage, Allergies constatées.
  * Le système attribue un tag `TEMP-BEN-YYYY-XXXXX` et propose la fusion ultérieure avec le NPI réel du patient dès son identification.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-01.3 : Vérification Ordinale des Professionnels de Santé (RPPS)
* **En tant que** médecin ou pharmacien,  
  **je souhaite** valider mon compte à l'aide de mon numéro d'inscription à l'Ordre National des Médecins ou Pharmaciens du Bénin,  
  **afin d'** obtenir les prérogatives légales de prescription et de consultation des dossiers médicaux.
* **Critères d'acceptation :**
  * Le système croise les données avec l'annuaire certifié de l'Ordre.
  * Tant que le statut n'est pas "Vérifié", le praticien ne peut pas signer d'e-ordonnance.
* **Priorité :** MUST  
* **Points d'effort :** 3 SP

---

#### US-01.4 : Génération de la Carte Santé QR Code Hors-Ligne
* **En tant que** patient,  
  **je souhaite** télécharger ou imprimer ma carte de santé arborant un QR code chiffré contenant mes informations d'urgence (groupe sanguin, allergies, contact tuteur),  
  **afin qu'** un soignant puisse les lire instantanément sans connexion internet.
* **Critères d'acceptation :**
  * Le QR code utilise la norme W3C Verifiable Credentials signée avec la clé privée de la plateforme.
  * La lecture par l'application soignante ne requiert aucune connexion internet active.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

### EPIC-02 : Dossier Médical Partagé (DMP) & Carnet de Santé Numérique

#### Objectif
Offrir une vue consolidée, sécurisée et chronologique de l'historique médical de chaque citoyen à l'échelle nationale.

---

#### US-02.1 : Consultation de la Fiche de Synthèse Médicale
* **En tant que** médecin traitant ou urgentiste,  
  **je souhaite** visualiser en un coup d'œil la synthèse vitale du patient (groupe sanguin, allergies majeures, pathologies chroniques, traitements en cours),  
  **afin de** prendre des décisions cliniques rapides et sécurisées.
* **Critères d'acceptation :**
  * La fiche de synthèse s'affiche en moins d'une seconde sur tout support.
  * Les alertes critiques (ex: Drépanocytose SS, Allergie Pénicilline) apparaissent en bandeau rouge clignotant / contraste élevé.
* **Priorité :** MUST  
* **Points d'effort :** 3 SP

---

#### US-02.2 : Suivi du Carnet Vaccinal Électronique (PEV Bénin)
* **En tant que** mère de famille ou soignant,  
  **je souhaite** consulter l'état vaccinal de mon enfant selon le calendrier vaccinal national du Bénin,  
  **afin d'** anticiper les rappels et éviter les retards préjudiciables.
* **Critères d'acceptation :**
  * Calendrier PEV complet modélisé (BCG, Polio, Pentavalent 1-2-3, VPI, Rougeole-Rubéole 1-2, Fièvre Jaune, etc.).
  * Les vaccins administrés sont horodatés avec le numéro de lot et la structure sanitaire.
  * Un code couleur explicite indique : Vert (À jour), Jaune (À faire prochainement), Rouge (En retard).
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-02.3 : Suivi des Consultations Prénatales (CPN)
* **En tant que** sage-femme,  
  **je souhaite** renseigner les données biométriques et cliniques de chaque consultation prénatale (CPN 1 à CPN 8),  
  **afin de** détecter précocement les grossesses à haut risque obstétrical.
* **Critères d'acceptation :**
  * Saisie guidée : Poids, Tension Artérielle, Hauteur Utérine, Bruits du Cœur Fœtal, Albuminurie, TPI Paludisme.
  * Calcul automatique du terme théorique et des dates de prochaines CPN.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

#### US-02.4 : Gestion du Consentement Patient & "Bris de Glace"
* **En tant que** patient,  
  **je souhaite** autoriser ou révoquer l'accès d'un praticien à mon dossier médical, tout en sachant qu'en cas d'urgence vitale un accès exceptionnel est prévu,  
  **afin de** préserver la confidentialité de ma vie privée.
* **Critères d'acceptation :**
  * Tout accès par "Bris de Glace" déclenche l'envoi immédiat d'un SMS au patient avec le nom du médecin, l'hôpital et l'heure.
  * Une justification textuelle obligatoire de 50 caractères minimum est exigée du médecin avant déverrouillage d'urgence.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

### EPIC-03 : Prise de Rendez-vous, Télémédecine & Téléexpertise Frugale

#### Objectif
Désenclaver les zones médicalement sous-dotées du Bénin en permettant les consultations à distance et la téléexpertise asynchrone entre agents de santé ruraux et médecins spécialistes.

---

#### US-03.1 : Prise de Rendez-vous Multicanale Adaptée au Contexte Local
* **En tant que** patient vivant en zone urbaine ou rurale,  
  **je souhaite** réserver un créneau de consultation auprès d'un centre de santé ou d'un spécialiste,  
  **afin d'** éviter de longues heures d'attente sur place sans garantie de prise en charge.
* **Critères d'acceptation :**
  * La prise de rendez-vous est disponible sur le portail Web, l'application mobile et par commande vocale.
  * Envoi d'une confirmation et d'un rappel SMS 24 heures et 2 heures avant le rendez-vous.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-03.2 : Téléexpertise Asynchrone Infirmier Rural -> Spécialiste
* **En tant qu'** infirmier responsable d'un Centre de Santé d'Arrondissement (CSA),  
  **je souhaite** téléverser un dossier de téléexpertise (photos de plaies, électrocardiogramme, constantes, court message audio en Fon ou Français) vers un médecin référent au CNHU,  
  **afin d'** obtenir un diagnostic éclairé sans faire voyager un patient fragile sur des centaines de kilomètres.
* **Critères d'acceptation :**
  * L'infirmier peut enregistrer les données même hors connexion; l'envoi s'effectue automatiquement dès détection d'un signal réseau.
  * Les photos sont compressées localement au format WebP/AVIF (moins de 200 Ko par cliché) avec maintien de la netteté diagnostique.
  * Le médecin spécialiste reçoit une notification prioritaire et dispose d'une interface d'avis formalisé avec prescription associée.
* **Priorité :** SHOULD  
* **Points d'effort :** 8 SP

---

#### US-03.3 : Téléconsultation Vidéo/Audio Frugale à Débit Adaptatif
* **En tant que** patient et médecin,  
  **nous souhaitons** réaliser une téléconsultation vidéo/audio capable de s'adapter automatiquement aux fluctuations de la connexion mobile 3G/2G,  
  **afin de** poursuivre la consultation médicale sans coupure bloquante.
* **Critères d'acceptation :**
  * Si la bande passante descend sous 100 kbps, la vidéo se coupe automatiquement pour préserver l'intelligibilité vocale HD (codec Opus jusqu'à 12 kbps).
  * L'échange est chiffré de bout en bout (DTLS-SRTP).
* **Priorité :** COULD  
* **Points d'effort :** 8 SP

---

### EPIC-04 : e-Prescription, Pharmacies & Traçabilité des Médicaments

#### Objectif
Sécuriser la délivrance des médicaments, éliminer les ordonnances illisibles et lutter contre la circulation des faux médicaments au Bénin.

---

#### US-04.1 : Émission d'Ordonnance Électronique Sécurisée avec Contrôle d'Interactions
* **En tant que** médecin,  
  **je souhaite** rédiger une ordonnance numérique avec assistance posologique et détection automatique des interactions médicamenteuses et allergies,  
  **afin de** prescrire en toute sécurité et délivrer un document numérique infalsifiable.
* **Critères d'acceptation :**
  * Le système alerte immédiatement si un médicament prescrit interagit négativement avec un traitement chronique ou une allergie déclarée.
  * L'ordonnance générée est signée électroniquement et pourvue d'un QR code de délivrance unique non réutilisable.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-04.2 : Dispensation Pharmacie & Annulation du QR Code
* **En tant que** pharmacien d'officine,  
  **je souhaite** scanner le QR code de l'ordonnance du patient pour enregistrer la délivrance des médicaments (totale ou partielle),  
  **afin d'** éviter qu'une même ordonnance ne soit servie frauduleusement dans plusieurs pharmacies.
* **Critères d'acceptation :**
  * Le scan affiche la prescription officielle issue de la base centrale.
  * Le pharmacien valide les quantités remises.
  * Le statut de l'ordonnance passe en "Délivrée" ou "Partiellement Délivrée" en temps réel.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-04.3 : Recherche Géolocalisée des Pharmacies de Garde et Disponibilité des Produits Vitaux
* **En tant que** citoyen en pleine nuit ou en week-end,  
  **je souhaite** localiser les pharmacies de garde ouvertes autour de moi et vérifier la disponibilité d'un médicament vital (ex: sérum antivenimeux, ACT antipaludique, insuline),  
  **afin de** me diriger immédiatement vers la bonne officine sans perte de temps critique.
* **Critères d'acceptation :**
  * La carte affiche les officines avec horaires, itinéraire et contact téléphonique direct.
  * Un filtre permet de cibler les stocks en temps réel déclarés par les officines.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-04.4 : Vérification Citoyenne de l'Authenticité du Médicament (Anti-Contrefaçon)
* **En tant que** patient ou soignant,  
  **je souhaite** scanner le code barre GS1 DataMatrix présent sur la boîte de médicament,  
  **afin de** vérifier qu'il s'agit d'un produit légal certifié par l'Agence Béninoise du Médicament (ABMed) et non d'une contrefaçon.
* **Critères d'acceptation :**
  * Le scan vérifie le numéro de lot et la date de péremption dans le registre de traçabilité.
  * Un badge vert "Médicament Authentique Certifié" ou rouge "Alerte : Lot non répertorié / Périmé" s'affiche avec la possibilité de signaler immédiatement la contrefaçon aux autorités.
* **Priorité :** COULD  
* **Points d'effort :** 8 SP

---

### EPIC-05 : Inclusion Forte, Accessibilité WCAG AAA & Vocal en Langues Nationales

#### Objectif
Garantir que la plateforme soit utilisable par 100% des citoyens du Bénin, y compris les personnes non alphabétisées, malvoyantes, malentendantes ou âgées.

---

#### US-05.1 : Interface Vocale Interactive en Langues Nationales (Fon, Yoruba, Bariba, Dendi)
* **En tant que** patient ne sachant ni lire ni écrire le français,  
  **je souhaite** écouter mes instructions médicales, mes posologies et mes rendez-vous énoncés oralement dans ma langue maternelle (Fon, Yoruba, Bariba, Dendi, Mina/Goun),  
  **afin de** comprendre parfaitement mon traitement en toute autonomie.
* **Critères d'acceptation :**
  * Un bouton audio très visible (icône de haut-parleur pulsant) est présent à côté de chaque texte clé.
  * L'utilisateur peut choisir sa langue préférée lors de l'accès par un simple clic sur un drapeau/symbole ou par commande vocale.
  * Les fichiers vocaux sont mis en cache localement pour une écoute instantanée même hors connexion.
* **Priorité :** MUST (Critère majeur du challenge)  
* **Points d'effort :** 8 SP

---

#### US-05.2 : Navigation Pictographique Universelle pour Non-Alphabétisés
* **En tant qu'** utilisateur analphabète,  
  **je souhaite** naviguer dans l'application grâce à des icônes explicites et des codes couleurs universels (cœur pour cardiologie, femme enceinte pour maternité, seringue pour vaccins, soleil/lune pour posologie matin/soir),  
  **afin de** repérer les informations sans devoir déchiffrer du texte.
* **Critères d'acceptation :**
  * 100% des parcours patients critiques disposent d'un équivalent pictographique complet.
  * Un tap prolongé sur une icône joue sa signification audio dans la langue choisie.
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-05.3 : Accessibilité Visuelle Maximale (Contraste Élevé, Gros Caractères, Lecteurs d'Écran)
* **En tant que** personne malvoyante ou atteinte de cataracte,  
  **je souhaite** basculer en mode fort contraste (jaune sur noir ou blanc sur noir) et agrandir la taille du texte à 200% sans perte d'information,  
  **afin de** lire confortablement l'écran de mon téléphone.
* **Critères d'acceptation :**
  * Conformité rigoureuse aux critères d'accessibilité WCAG 2.1 niveau AAA (ratios de contraste >= 7:1).
  * Balises `aria-label`, rôles ARIA et structure sémantique HTML5 parfaits pour compatibilité TalkBack (Android) et VoiceOver (iOS).
* **Priorité :** MUST  
* **Points d'effort :** 5 SP

---

#### US-05.4 : Accessibilité Auditive & Vidéos en Langue des Signes Béninoise
* **En tant que** patient malentendant ou sourd,  
  **je souhaite** avoir des sous-titres automatiques pour tous les contenus sonores et des capsules d'animation en Langue des Signes Béninoise (LSB) pour les démarches de santé fondamentales,  
  **afin de** jouir d'une égalité d'accès aux messages de santé publique.
* **Critères d'acceptation :**
  * Toutes les notifications sonores sont doublées de retours visuels (flashs, popups) et haptiques (vibrations smartphone).
  * Les guides de prévention sont sous-titrés et illustrés visuellement.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

### EPIC-06 : Résilience Hors-Ligne (Offline-First) & Bas Débit

#### Objectif
Permettre aux soignants dans les centres isolés (Atacora, Alibori, Couffo, etc.) de travailler sans interruption même en cas de coupure internet prolongée.

---

#### US-06.1 : Saisie Clinique Intégrale en Mode Déconnecté
* **En tant que** médecin ou infirmier en mission foraine ou dispensaire rural sans couverture réseau,  
  **je souhaite** consulter les dossiers préchargés, enregistrer de nouvelles consultations et prescrire des traitements en mode hors-ligne,  
  **afin que** le soin ne s'arrête jamais faute de réseau internet.
* **Critères d'acceptation :**
  * L'application (PWA) stocke les saisies dans une base locale sécurisée et chiffrée (IndexedDB / SQLite).
  * Un indicateur clair d'état réseau affiche "Mode Hors-Ligne (Données sauvegardées localement)".
* **Priorité :** MUST  
* **Points d'effort :** 8 SP

---

#### US-06.2 : Synchronisation Résiliente et Gestion Automatique des Conflits
* **En tant que** soignant reconnectant son appareil à internet,  
  **je souhaite** que mes consultations enregistrées hors-ligne se synchronisent silencieusement et de façon fiable avec le serveur central,  
  **afin de** mettre à jour le Dossier Médical Partagé sans risque d'écrasement de données.
* **Critères d'acceptation :**
  * Synchronisation en tâche de fond (Background Sync API).
  * En cas de modification concurrente, application d'un algorithme de fusion sans conflit (CRDT / Last-Write-Wins avec traçabilité d'audit).
* **Priorité :** MUST  
* **Points d'effort :** 8 SP

---

### EPIC-07 : Urgences Médicales, SAMU & Registre des Lits Disponibles

#### Objectif
Réduire drastiquement le temps d'attente lors des urgences vitales et éliminer le fléau des décès évitables par errance hospitalière.

---

#### US-07.1 : Bouton d'Urgence Citoyen (SOS Santé 112)
* **En tant que** citoyen face à un accident de la route ou un malaise grave,  
  **je souhaite** déclencher un appel d'urgence en un clic avec envoi instantané de mes coordonnées GPS au centre de régulation SAMU le plus proche,  
  **afin d'** obtenir une assistance médicale dans les délais les plus brefs.
* **Critères d'acceptation :**
  * Un bouton d'urgence flottant accessible sans login depuis l'écran d'accueil.
  * Transmission automatique par requête web légère ou SMS automatique de secours des coordonnées latitude/longitude et de l'identité du déclencheur.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

#### US-07.2 : Tableau de Bord National des Lits et Couveuses Disponibles
* **En tant que** médecin régulateur du SAMU ou urgentiste de garde,  
  **je souhaite** visualiser en direct la disponibilité des lits de réanimation, lits de médecine, blocs opératoires et couveuses dans chaque établissement du Bénin,  
  **afin d'** orienter immédiatement le patient vers l'hôpital capable de le prendre en charge sans refoulement.
* **Critères d'acceptation :**
  * Mise à jour en un clic par les surveillants de service hospitalier.
  * Alerte visuelle clignotante quand un hôpital atteint 100% de saturation.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

### EPIC-08 : Tiers-Payant, Intégration AMU/ARCH & Paiement Mobile Money

#### Objectif
Garantir la solvabilité des soins, automatiser la prise en charge pour les populations défavorisées et faciliter le paiement digital.

---

#### US-08.1 : Vérification Instantanée des Droits d'Assurance Maladie Universelle (AMU / ARCH)
* **En tant qu'** agent de facturation hospitalière ou soignant,  
  **je souhaite** vérifier les droits d'un patient au volet assurance santé du projet ARCH / AMU à partir de son NPI,  
  **afin d'** appliquer immédiatement l'exonération ou le taux de prise en charge légal.
* **Critères d'acceptation :**
  * Le système retourne instantanément le pourcentage couvert (ex: 80% ou 100% panier de soins indigents).
  * La facture patient est automatiquement allégée du montant pris en charge par l'État.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

#### US-08.2 : Paiement Sécurisé du Reste à Charge par Mobile Money (MoMo / Flooz / Celtiis)
* **En tant que** patient ou proche d'un malade,  
  **je souhaite** régler la consultation ou les médicaments directement depuis mon compte Mobile Money (MTN MoMo, Moov Money, Celtiis Cash),  
  **afin d'** éviter de chercher de l'espèce ou de faire la queue au guichet de la caisse.
* **Critères d'acceptation :**
  * Déclenchement d'un push USSD sur le téléphone du payeur pour validation par son code secret.
  * Confirmation immédiate et génération d'un reçu fiscal numérique téléchargeable et archivé dans le dossier.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

### EPIC-09 : Veille Épidémiologique & Pilotage Sanitaire (Ministère / ANSSP)

#### Objectif
Outiller les décideurs de la santé publique béninoise avec des métriques fiables et en temps réel pour contrer les épidémies.

---

#### US-09.1 : Déclaration Immédiate de Maladie à Déclaration Obligatoire (MDO)
* **En tant que** médecin constatant un cas suspect de maladie hautement contagieuse (Fièvre Lassa, Choléra, Méningite, Rougeole),  
  **je souhaite** que le système envoie automatiquement une fiche d'alerte épidémiologique à la Direction Départementale de la Santé (DDS) et à l'ANSSP,  
  **afin de** déclencher immédiatement les investigations et le cordon sanitaire.
* **Critères d'acceptation :**
  * Le formulaire MDO s'ouvre automatiquement dès la saisie du diagnostic ciblé.
  * Transmission chiffrée prioritaire instantanée vers les dashboards de surveillance épidémiologique.
* **Priorité :** SHOULD  
* **Points d'effort :** 5 SP

---

#### US-09.2 : Carte Décisionnelle Géospatiale de l'Incidence Sanitaire
* **En tant que** Directeur Départemental de la Santé (DDS) ou Ministre de la Santé,  
  **je souhaite** visualiser sur une carte interactive du Bénin les foyers infectieux, les taux d'hospitalisation et les stocks sanitaires par commune et département,  
  **afin d'** allouer stratégiquement les ressources matérielles et humaines.
* **Critères d'acceptation :**
  * Cartographie choroplèthe interactive du Bénin (12 départements, 77 communes).
  * Filtrage temporel, par type de pathologie et par tranche d'âge.
* **Priorité :** SHOULD  
* **Points d'effort :** 8 SP

---

### EPIC-10 : Innovations, Triage Assisté par IA Frugale & Assistant Santé Omnicanal

#### Objectif
Exploiter l'intelligence artificielle frugale et les canaux de messagerie populaires pour démocratiser l'information médicale fiable.

---

#### US-10.1 : Moteur de Triage Clinique Léger Embarqué (Symptom Checker Local)
* **En tant que** citoyen ressentant des malaises ou agent de santé communautaire,  
  **je souhaite** répondre à un questionnaire médical guidé (disponible en texte ou audio) sans nécessiter de serveur distant puissant,  
  **afin d'** obtenir une première orientation de gravité (Urgence Vitale / Consultation sous 24h / Soins à domicile).
* **Critères d'acceptation :**
  * Le moteur de règles cliniques et l'arbre de décision s'exécutent entièrement en local côté client (WebAssembly / JavaScript léger).
  * Aucun diagnostic ferme n'est émis : uniquement un niveau de triage et des recommandations de sécurité explicites.
* **Priorité :** COULD (Forte valeur ajoutée démonstrateur)  
* **Points d'effort :** 5 SP

---

#### US-10.2 : Assistant Santé Intelligent WhatsApp & SMS
* **En tant que** citoyen sans smartphone sophistiqué ou préférant WhatsApp,  
  **je souhaite** dialoguer avec un bot officiel de santé certifié pour connaître les gestes de premiers secours, le calendrier vaccinal ou trouver une pharmacie,  
  **afin d'** accéder aux informations médicales officielles sur mon canal quotidien habituel.
* **Critères d'acceptation :**
  * Réponse instantanée aux requêtes par mot-clé ou langage naturel.
  * Respect strict du secret médical : aucune donnée clinique sensible n'est archivée sans consentement sur les serveurs tiers.
* **Priorité :** COULD  
* **Points d'effort :** 8 SP

---

## TABLEAU RÉCAPITULATIF DES USER STORIES & CHARGES

| Epic ID | Nombre d'US | Somme Story Points | Must | Should | Could |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **EPIC-01 : IAM & Identité** | 4 | 18 SP | 4 | 0 | 0 |
| **EPIC-02 : DMP & Carnet** | 4 | 18 SP | 3 | 1 | 0 |
| **EPIC-03 : Téléconsultation** | 3 | 21 SP | 1 | 1 | 1 |
| **EPIC-04 : Pharmacie & Lots** | 4 | 23 SP | 3 | 0 | 1 |
| **EPIC-05 : Inclusion & Vocal** | 4 | 23 SP | 3 | 1 | 0 |
| **EPIC-06 : Offline-First** | 2 | 16 SP | 2 | 0 | 0 |
| **EPIC-07 : Urgences & Lits** | 2 | 10 SP | 0 | 2 | 0 |
| **EPIC-08 : AMU & MoMo** | 2 | 10 SP | 0 | 2 | 0 |
| **EPIC-09 : Épidémiologie** | 2 | 13 SP | 0 | 2 | 0 |
| **EPIC-10 : Innovations & IA** | 2 | 13 SP | 0 | 0 | 2 |
| **TOTAL** | **29 US** | **165 SP** | **16** | **9** | **4** |
