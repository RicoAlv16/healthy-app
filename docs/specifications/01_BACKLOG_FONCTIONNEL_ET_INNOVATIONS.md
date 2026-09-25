# CAHIER DES CHARGES FONCTIONNEL & BACKLOG EXHAUSTIF
## Plateforme Nationale Intégrée d'e-Santé au Bénin (Care.bj)

---

## 1. VISION STRATÉGIQUE & CONTEXTE DU PROJET

### 1.1 Contexte National (Bénin)
Le système de santé béninois s'articule autour des structures pyramidales allant des Centres de Santé d'Arrondissement (CSA) et Centres de Santé de Commune (CSC) jusqu'aux Hôpitaux de Zone (HZ), Centres Hospitaliers Départementaux (CHD) et Centres Hospitaliers Universitaires (CNHU-HKM, CHU-MEL, CHU-Mère-Enfant de la Lagune, etc.).
Dans le cadre de la politique nationale de transformation numérique impulsée par le Ministère de la Santé, l'**ASIN** (Agence des Systèmes d'Information et du Numérique), l'**ANSSP** (Agence Nationale de Soins de Santé Primaires) et l'**ANIP** (Agence Nationale d'Identification des Personnes avec le NPI - Numéro Personnel d'Identification), la plateforme **Care.bj** a pour vocation de devenir le **socle numérique souverain, universel et inclusif** reliant l'ensemble de l'écosystème médical béninois.

### 1.2 Objectif de la Plateforme
Offrir un écosystème numérique unifié, robuste et accessible permettant :
1. De fluidifier le parcours patient de la consultation primaire en milieu rural jusqu'aux soins spécialisés.
2. D'assurer une continuité des soins sans rupture documentaire grâce au Dossier Médical Partagé (DMP).
3. D'éliminer les barrières d'accès pour les populations vulnérables : analphabètes, malvoyants, malentendants, et zones à faible connectivité réseau (2G/3G/zones blanches).
4. De sécuriser la chaîne du médicament face au fléau des contrefaçons.
5. De doter les autorités sanitaires (DDS, Ministère) d'outils d'aide à la décision et de veille épidémiologique en temps réel.

---

## 2. MATRICE COMPLÈTE DES ACTEURS & PROFILS DU SYSTÈME

| Code Acteur | Rôle / Entité | Description & Responsabilités |
| :--- | :--- | :--- |
| **ACT-PAT** | Patient / Citoyen | Tout citoyen ou résident au Bénin (identifié via NIP ou ID provisoire), ses ayants droit et aidants familiaux. |
| **ACT-MED** | Médecin (Généraliste / Spécialiste) | Praticien hospitalier ou libéral habilité à diagnostiquer, prescrire et télé-expertiser. |
| **ACT-INF** | Infirmier / Sage-femme / Aide-soignant | Personnel soignant de première ligne, gestion des soins courants, vaccinations, maternité. |
| **ACT-PHA** | Pharmacien d'officine & Hospitalier | Délivrance d'ordonnances, validation de dispensation, gestion des stocks et veille contrefaçon. |
| **ACT-LAB** | Biologiste / Technicien de Laboratoire | Enregistrement des prélèvements, saisie et téléversement des bilans biologiques. |
| **ACT-RAD** | Radiologue / Centre d'imagerie | Dépôt et interprétation des examens radiologiques (radios, échographies, scanners). |
| **ACT-ADM** | Administration Hospitalière / Accueil | Admissions, facturation, gestion des lits, coordination des rendez-vous. |
| **ACT-SAM** | Régulateur SAMU / Services d'Urgence | Triage d'urgence, géolocalisation des ambulances, orientation vers les lits disponibles. |
| **ACT-AMU** | Organisme d'Assurance Maladie (ARCH / AMU) | Vérification des droits, tiers-payant, validation des prises en charge et facturation. |
| **ACT-SAN** | Autorités Sanitaires (Ministère, DDS, ANSSP) | Surveillance épidémiologique, pilotage sanitaire, allocation des ressources et statistiques. |
| **ACT-SYS** | Administrateur Système & DPO | Gestion technique, sécurité, auditabilité, conformité APDP (Protection des données). |

---

## 3. BACKLOG FONCTIONNEL EXHAUSTIF PAR DOMAINE MÉTIER

### DOMAINE 1 : IDENTITÉ, IDENTIFICATION & GESTION DES ACCÈS (IAM)

* **FONC-IAM-01 : Intégration NPI / ANIP** : Liaison native avec le registre national d'identification béninois (Numéro Personnel d'Identification) pour créer une identité patient infalsifiable et unifiée.
* **FONC-IAM-02 : Enrôlement dégradé / Mode forain** : Création d'identifiants temporaires biométriques/locaux avec photo et empreinte (pour enfants sans NPI, réfugiés, ou urgences vitales sans papiers), avec réconciliation automatique ultérieure.
* **FONC-IAM-03 : Cartes de Santé Numériques & QR Codes hors-ligne** : Génération d'une carte de santé physique ou sur smartphone avec QR code cryptographique signé (W3C Verifiable Credentials) contenant le groupe sanguin, les allergies vitales et l'accès d'urgence.
* **FONC-IAM-04 : Authentification multi-facteurs (MFA) adaptée au terrain** :
  * OTP SMS (via passerelles locales MTN Bénin, Moov Africa, Celtiis).
  * Reconnaissance biométrique locale (WebAuthn / FIDO2 / TouchID / FaceID) sur smartphone soignant.
  * Clé de sécurité FIDO physique pour les postes fixes des hôpitaux.
* **FONC-IAM-05 : Annuaire National des Professionnels de Santé (RPPS-BJ)** : Vérification automatique de l'inscription à l'Ordre National des Médecins du Bénin (ONMB) et à l'Ordre des Pharmaciens pour attribuer les droits de prescription.
* **FONC-IAM-06 : Gestion des Cercles de Confiance & Ayants droit** : Capacité pour un chef de famille ou tuteur de gérer les carnets de santé de ses enfants, parents âgés ou personnes dépendantes.

---

### DOMAINE 2 : DOSSIER MÉDICAL PARTAGÉ (DMP) & CARNET DE SANTÉ UNIFIÉ

* **FONC-DMP-01 : Dossier Clinique Longitudinale** : Historique médical continu (antécédents médicaux, chirurgicaux, familiaux, facteurs de risque, tabac, alcool, drépanocytose, HTA, diabète).
* **FONC-DMP-02 : Carnet Vaccinal Numérique Intelligent** :
  * Suivi du Programme Élargi de Vaccination (PEV Bénin : BCG, Polio, Pentavalent, Rotavirus, Pneumo, Rougeole-Rubéole, Fièvre Jaune, Méningite, VPH).
  * Rappels automatiques par SMS et messages vocaux en langues locales.
  * Preuve de vaccination vérifiable offline pour voyages et scolarité.
* **FONC-DMP-03 : Carnet de Maternité & Suivi Prénatal (CPN)** :
  * Suivi des 8 Consultations Prénatales recommandées par l'OMS.
  * Courbes de hauteur utérine, dépistage de pré-éclampsie, statut sérologique, supplémentation en fer/acide folique et TPI paludisme.
  * Alerte rouge automatique transmise au centre de santé en cas de signaux d'alarme (hémorragie, fièvre, céphalées aiguës).
* **FONC-DMP-04 : Courbes de Croissance Pédiatrique & Suivi Nutritionnel** :
  * Calcul automatique des scores Z (Poids/Âge, Taille/Âge, Poids/Taille, Périmètre Brachial).
  * Détection précoce de la malnutrition aiguë modérée (MAM) ou sévère (MAS) avec orientation vers les CREN (Centres de Récupération et d'Éducation Nutritionnelle).
* **FONC-DMP-05 : Historique d'Allergies & Contre-indications Majeures** : Registre d'alertes bloquantes prioritaires (allergie pénicilline, déficit en G6PD, allergie sulfamides).
* **FONC-DMP-06 : Module Spécifique Drépanocytose (SS/SC)** : Registre national du suivi drépanocytaire (taux d'Hb de base, protocole en cas de crise vaso-occlusive, historique transfusionnel et phénotypage érythrocytaire).
* **FONC-DMP-07 : Dossier d'Imagerie & Documents Médicaux** : Téléversement et consultation de comptes-rendus, PDF d'analyses, visualiseur DICOM ultra-léger compressé pour radiographies.
* **FONC-DMP-08 : Gestion du Consentement & Matrice d'Accès** :
  * Le patient décide quels soignants ont accès à son dossier (opt-in / opt-out).
  * Fonction "Bris de Glace" (Emergency Break-Glass) : accès en urgence vitale tracé, consigné et notifié au patient par SMS avec motif obligatoire.
* **FONC-DMP-09 : Interopérabilité HL7 FHIR v4** : Exposition et consommation des ressources standardisées (`Patient`, `Observation`, `Condition`, `MedicationRequest`, `Encounter`).

---

### DOMAINE 3 : CONSULTATION, RENDEZ-VOUS & TÉLÉMÉDECINE RURALE

* **FONC-TLM-01 : Prise de Rendez-vous Multicanale** :
  * Via application Web/Mobile.
  * Via Borne tactile d'accueil en hôpital.
  * Via SMS interactif / Menu USSD (`*XYZ#`) pour téléphones basiques sans internet.
  * Via standard vocal automatisé en langue nationale.
* **FONC-TLM-02 : Téléconsultation Vidéo/Audio Frugale (Basse Bande Passante)** :
  * Flux vidéo WebRTC adaptatif avec dégradation gracieuse en audio pur (15 kbps) en cas de chute de débit réseau.
  * Optimisation spécifique pour réseaux mobiles fluctuants 2G/3G (codec Opus et VP8/AV1 ultra-compressé).
* **FONC-TLM-03 : Téléexpertise Médicale Asynchrone (Store & Forward)** :
  * Possibilité pour un infirmier en milieu rural de soumettre un cas complexe (photos de lésions, tracé ECG, paramètres vitaux, observation vocale) à un médecin spécialiste à Cotonou ou Parakou.
  * Rapport d'expertise formalisé avec préconisation thérapeutique sous 24-48h.
* **FONC-TLM-04 : Salle d'Attente Virtuelle & File d'Attente Dynamique** : Affichage transparent du temps d'attente estimé avec alerte SMS 15 minutes avant le passage effectif.
* **FONC-TLM-05 : Télé-suivi des Maladies Chroniques (HTA, Diabète, Asthme)** : Saisie régulière des auto-mesures (glycémie capillaire, pression artérielle) avec génération de graphiques de tendances et alertes de décompensation.

---

### DOMAINE 4 : PRESCRIPTION ÉLECTRONIQUE, PHARMACIE & TRAÇABILITÉ DU MÉDICAMENT

* **FONC-PHA-01 : e-Prescription Sécurisée & Infalsifiable** :
  * Émission d'ordonnances numériques signées cryptographiquement.
  * Attribution d'un QR code unique non réutilisable (anti-fraude à la délivrance multiple).
* **FONC-PHA-02 : Moteur de Détection des Interactions Médicamenteuses & Surdosages** :
  * Vérification automatique des contre-indications croisées avec le dossier patient (ex: AINS chez un insuffisant rénal ou une femme enceinte).
  * Adaptation posologique automatique selon l'âge et le poids de l'enfant.
* **FONC-PHA-03 : Localisation & Stock en Temps Réel des Médicaments Essentiels** :
  * Géolocalisation des pharmacies de garde les plus proches.
  * Consultation de la disponibilité des molécules vitales (antipaludéens CTA, insuline, sérum antivenimeux, antibiotiques injectables, solutés).
* **FONC-PHA-04 : Lutte Anti-Contrefaçon & Traçabilité GS1 / Blockchain** :
  * Scan du code barre DataMatrix/QR de la boîte de médicament par le patient ou le pharmacien.
  * Vérification de l'authenticité et de l'intégrité du lot auprès de l'ABMed (Agence Béninoise du Médicament).
  * Signalement citoyen immédiat en cas de boîte suspecte ou d'effet indésirable grave (pharmacovigilance).
* **FONC-PHA-05 : Dispensation Fractionnée & Suivi de l'Observance** :
  * Enregistrement des délivrances partielles (si rupture partielle de stock ou contrainte financière).
  * Plan de prise interactif guidé avec alertes sonores de rappel de prise de médicament.

---

### DOMAINE 5 : LABORATOIRES D'ANALYSES, BIOLOGIE & IMAGERIE MÉDICALE

* **FONC-LAB-01 : Prescription Connectée d'Analyses Médicales** : Envoi direct de l'ordonnance de biologie au laboratoire choisi par le patient.
* **FONC-LAB-02 : Transmission Sécurisée des Résultats de Biologie** : Intégration directe des valeurs chiffrées (NFS, Ionogramme, Créatinine, GE/Goutte Épaisse, TDR Palu, Sérologies) avec mise en valeur des seuils d'alerte critiques.
* **FONC-LAB-03 : Connexion avec les Systèmes LIMS des Hôpitaux** : Passerelle d'interconnexion pour récupération automatisée des automates de laboratoire.
* **FONC-LAB-04 : Archivage & Visualisation Radiologique (Mini-PACS Cloud)** :
  * Stockage d'images médicales (radiographies pulmonaires, mammographies, échographies obstétricales).
  * Visualiseur web ergonomique avec zoom, mesure, contraste et anotations pour praticiens distants.

---

### DOMAINE 6 : URGENCES, GÉOLOCALISATION & GESTION DES RESSOURCES HOSPITALIÈRES

* **FONC-URG-01 : Bouton d'Urgence Citoyen (SOS Santé)** :
  * Déclenchement d'un appel d'urgence vers le SAMU / 112 ou centre d'urgence le plus proche avec transmission instantanée des coordonnées GPS et de la fiche médicale d'urgence.
  * Accessible sans déverrouillage préalable sur mobile ou via code USSD d'urgence.
* **FONC-URG-02 : Régulation Médicale & Dispatching Ambulancier** :
  * Tableau de bord cartographique en temps réel de la flotte d'ambulances.
  * Guidage de l'ambulance vers l'établissement disposant des plateaux techniques adaptés et de places libres.
* **FONC-URG-03 : Registre National des Lits Disponibles (Bed Management)** :
  * Visibilité en direct sur les lits de réanimation, lits de maternité, couveuses de néonatalogie et blocs opératoires disponibles dans tous les hôpitaux de zone et CHD.
* **FONC-URG-04 : Gestion des Stocks de Sang (Banque de Sang / CNTS)** :
  * Indicateur en direct des stocks de poches de sang par groupe sanguin et rhésus (O-, A+, etc.) dans chaque antenne du Centre National de Transfusion Sanguine.
  * Appel d'urgence ciblé aux donneurs compatibles par SMS géolocalisé en cas de pénurie critique.

---

### DOMAINE 7 : ASSURANCE MALADIE UNIVERSELLE (AMU / ARCH) & FACTURATION

* **FONC-AMU-01 : Vérification d'Éligibilité en Ligne (NIP / Biométrie)** :
  * Interrogation instantanée des bases de données du Régime d'Assurance Maladie Universelle (ARCH - Volet Assurance Santé, mutuelles privées, assurances d'entreprises).
  * Affichage immédiat du taux de couverture (ex: 80% ou 100% pour le panier de soins de base des populations vulnérables).
* **FONC-AMU-02 : Dématérialisation des Feuilles de Soins & Prise en Charge** :
  * Émission numérique des accords préalables et feuilles de soins électroniques.
  * Suppression intégrale de la paperasse physique et des délais de traitement de plusieurs mois.
* **FONC-AMU-03 : Tiers-Payant & Paiement Intégré Mobile Money** :
  * Calcul automatique du reste à charge patient (ticket modérateur).
  * Paiement instantané et sécurisé via les passerelles Mobile Money locales : **MTN Mobile Money (MoMo)**, **Moov Money (Flooz)**, **Celtiis Cash** et cartes bancaires.
* **FONC-AMU-04 : Détection Automatisée de la Fraude aux Remboursements** : Contrôles d'intégrité algorithmiques pour détecter les doubles facturations, prescriptions fictives ou anomalies statistiques de dispensation.

---

### DOMAINE 8 : SANTÉ PUBLIQUE, ÉPIDÉMIOLOGIE & MINISTÈRE DE LA SANTÉ

* **FONC-SAN-01 : Déclaration Obligatoire Immédiate (Maladies à Potentiel Épidémique)** :
  * Envoi d'alertes instantanées aux autorités sanitaires lors de la saisie d'un cas suspect de maladie à notification obligatoire (Fièvre hémorragique de Lassa, Choléra, Méningite, Rougeole, Fièvre Jaune, Rage).
* **FONC-SAN-02 : Tableaux de Bord Décisionnels pour les Décideurs (ANSSP, MS, DDS)** :
  * Cartographie SIG interactive de l'incidence des maladies par département, commune et arrondissement.
  * Indicateurs de mortalité maternelle et infantile, taux de couverture vaccinale, indice de fréquentation des formations sanitaires.
* **FONC-SAN-03 : Modélisation Prédictive des Épidémies** : Algorithmes prédictifs basés sur les tendances de consultations, les données météorologiques locales et les historiques pour anticiper les pics saisonniers de paludisme ou de diarrhées.
* **FONC-SAN-04 : Campagnes de Prévention Ciblées par SMS Géolocalisés** : Diffusion de messages de sensibilisation sanitaire lors d'alertes (ex: prévention inondations et choléra dans la vallée de l'Ouémé ou campagnes de distribution de moustiquaires imprégnées MILDA).

---

### DOMAINE 9 : INCLUSION FORTE, ACCESSIBILITÉ UNIVERSELLE & HORS-LIGNE (OBLIGATOIRE DU DÉFI)

* **FONC-INC-01 : Accessibilité Visuelle Avancée (WCAG 2.1 niveau AAA)** :
  * Mode contraste élevé (Dark Mode / High Contrast ambré ou monochrome).
  * Agrandissement dynamique de la typographie sans déstructuration du layout (police Dyslexic-friendly incluse).
  * Balisage sémantique ARIA irréprochable et compatibilité certifiée avec les lecteurs d'écran NVDA, VoiceOver et TalkBack.
* **FONC-INC-02 : Accessibilité Auditive** :
  * Sous-titrage systématique et instantané des vidéos éducatives et instructions médicales.
  * Transcriptions textuelles des messages vocaux de consultation.
  * Intégration de capsules d'explications animées en Langue des Signes Béninoise (LSB) pour les démarches et consentements clés.
* **FONC-INC-03 : Inclusion pour Personnes Non-Alphabétisées & Multilinguisme Local** :
  * **Navigation Pictographique Universelle** : Utilisation d'icônes médicales claires, intuitives et culturellement adaptées au contexte béninois (anatomie simplifiée, couleurs de gravité standardisées).
  * **Interface Vocale Interactive Multilingue** : Possibilité de naviguer, écouter son ordonnance, ses rendez-vous et poser des questions de santé en langues nationales :
    * **Fon**
    * **Yoruba**
    * **Bariba (Baatonum)**
    * **Dendi**
    * **Mina / Goun**
* **FONC-INC-04 : Architecture Offline-First & Synchronisation Résiliente** :
  * Fonctionnement de 100% des fonctions de consultation et de saisie clinique de base sans connexion internet active.
  * Base de données locale sécurisée sur le périphérique (IndexedDB chiffré / SQLite local).
  * Mécanisme de réconciliation bidirectionnelle par delta et CRDT (Conflict-free Replicated Data Types) dès la détection d'une connexion (Wi-Fi, 3G/4G).
* **FONC-INC-05 : Frugalité Numérique & Poids Plume (Basse Bande Passante)** :
  * Taille de bundle initiale < 150 KB.
  * Compression extrême des assets et zéro dépendance lourde inutile.
  * Fonctionnement optimisé sur smartphones d'entrée de gamme Android (RAM 1 Go, Android Go edition).

---

### DOMAINE 10 : FONCTIONNALITÉS INNOVANTES & IA FRUGALE AU SERVICE DU BÉNIN

* **FONC-INN-01 : Triage Pré-Clinique par IA Frugale (Offline Symptom Checker)** :
  * Moteur de règles cliniques et modèle d'arbre décisionnel léger fonctionnant directement dans le navigateur du patient/agent communautaire.
  * Évaluation de la gravité (Vert: soins à domicile, Orange: consultation sous 48h, Rouge: urgence vitale immédiate).
* **FONC-INN-02 : Détection Dermatologique Assistée par Caméra Mobile** :
  * Analyse photographique de lésions cutanées fréquentes en Afrique de l'Ouest (Ulcère de Buruli, Gale, Teigne, Mélanome, dermatoses) pour orienter vers un dermatologue référent.
* **FONC-INN-03 : Carnet de Santé Vocal Intelligent (Smart Voice Diary)** :
  * Enregistrement par le patient de ses symptômes au format vocal dans sa langue maternelle.
  * Transcription et synthèse automatique par IA pour le médecin avec traduction française automatique et extraction des signaux d'alerte.
* **FONC-INN-04 : Monitoring IoT de la Chaîne du Froid des Vaccins (Cold Chain Guard)** :
  * Intégration de capteurs de température connectés (LoRaWAN / GSM) placés dans les glacières solaires des dispensaires ruraux.
  * Alerte SMS automatique au gestionnaire de santé en cas de dépassement de la plage réglementaire (+2°C à +8°C).
* **FONC-INN-05 : Agent Conversationnel Santé Omnicanal (WhatsApp Bot & USSD)** :
  * Disponibilité d'un assistant santé d'orientation officielle certifié sur WhatsApp (le canal de messagerie le plus utilisé au Bénin).
  * Possibilité de recevoir des rappels de traitement et des conseils nutritionnels sans installer d'application dédiée.

---

## 4. MATRICE DE PRIORISATION PRODUIT (MODÈLE MOSCOW)

| Identifiant | Fonctionnalité | Priorité MoSCoW | Justification |
| :--- | :--- | :---: | :--- |
| **FONC-IAM-01/03** | Authentification, Profils & Carte QR Offline | **MUST** | Socle indispensable d'identification et de sécurité. |
| **FONC-DMP-01/02/05** | Dossier Médical de base, Vaccins & Allergies | **MUST** | Cœur du suivi patient et sécurité clinique immédiate. |
| **FONC-INC-01/03/04** | Accessibilité WCAG, Vocale Langues & Offline | **MUST** | Impératif non négociable du challenge e-Santé Bénin. |
| **FONC-PHA-01/03** | e-Prescription & Annuaire Pharmacies | **MUST** | Continuité du parcours soignant -> patient -> délivrance. |
| **FONC-TLM-02/03** | Téléexpertise rurale & Téléconsultation audio | **SHOULD** | Réduit la fracture médicale entre villes et campagnes. |
| **FONC-URG-01/03** | Bouton SOS & Registre des lits d'urgence | **SHOULD** | Sauve des vies en évitant l'errance hospitalière. |
| **FONC-AMU-01/03** | Vérification ARCH/AMU & Mobile Money | **SHOULD** | Viabilité financière et accessibilité aux indigents. |
| **FONC-INN-01/03** | Triage IA Frugale & Carnet Vocal multilingue | **COULD** | Forte valeur ajoutée innovante pour le challenge. |
| **FONC-PHA-04** | Traçabilité Blockchain / GS1 contre contrefaçon | **COULD** | Lutte majeure de santé publique à moyen terme. |
| **FONC-INN-04** | Monitoring IoT de la chaîne du froid vaccinale | **WON'T (V1)** | Nécessite du hardware physique dédié sur le terrain. |
