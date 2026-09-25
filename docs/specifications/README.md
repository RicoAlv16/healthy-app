# DOSSIER DE SPÉCIFICATIONS TECHNIQUES & FONCTIONNELLES
## Projet e-Santé Bénin : Plateforme Nationale Inclusive "Care.bj"

---

### Présentation Générale

Ce dossier regroupe l'intégralité du cahier des charges, des spécifications fonctionnelles détaillées, du backlog exhaustif et du plan d'implémentation technique pour la plateforme **Care.bj**, conçue pour révolutionner le secteur de la santé au Bénin dans le cadre du **Challenge e-Santé Bénin**.

La solution vise à connecter l'ensemble des acteurs de l'écosystème de santé (patients, médecins, infirmiers ruraux, pharmaciens, laboratoires, SAMU, ministères et agences étatiques telles que l'ASIN, l'ANIP et l'ANSSP) avec une exigence non négociable d'**accessibilité universelle**, d'**inclusion pour les non-alphabétisés (support vocal en Fon, Yoruba, Bariba, Dendi)** et de **fonctionnement hors-ligne (Offline-First)** pour les zones à connectivité limitée.

---

### Structure du Dossier de Spécifications

Le dossier est structuré en trois volets complémentaires et approfondis :

| Fichier | Titre | Contenu Clé |
| :--- | :--- | :--- |
| **[01_BACKLOG_FONCTIONNEL_ET_INNOVATIONS.md](./01_BACKLOG_FONCTIONNEL_ET_INNOVATIONS.md)** | **Cahier des Charges Fonctionnel & Backlog Exhaustif** | - Cartographie complète des 11 rôles acteurs.<br>- 10 domaines métiers détaillés (DMP, e-Prescription, Télémédecine, Urgences, AMU/ARCH, etc.).<br>- Innovations : Triage IA Frugale, traçabilité des médicaments, carnet vocal.<br>- Matrice de priorisation MoSCoW. |
| **[02_EPICS_ET_USER_STORIES.md](./02_EPICS_ET_USER_STORIES.md)** | **Organisation en Epics & User Stories** | - 10 Epics structurés.<br>- 29 User Stories complètes au format BDD (En tant que / Je souhaite / Afin de).<br>- Critères d'acceptation en syntaxe Gherkin (Étant donné que / Quand / Alors).<br>- Chiffrage en Story Points Fibonacci (165 SP au total). |
| **[03_PLAN_IMPLEMENTATION_TECHNIQUE.md](./03_PLAN_IMPLEMENTATION_TECHNIQUE.md)** | **Plan d'Implémentation Technique de Bout en Bout** | - Architecture C4, stack Next.js 16 / TypeScript / PostgreSQL PostGIS / Redis / MinIO.<br>- Conformité APDP Bénin, HDS, chiffrement et politique de "Bris de Glace".<br>- Fichiers prêts à l'emploi : `Dockerfile` multi-stage (< 95 Mo) & `docker-compose.yml`.<br>- Pipeline CI/CD GitHub Actions complet avec scans de sécurité et tests d'accessibilité.<br>- Pyramide des tests, observabilité Prometheus/Grafana/Sentry et Roadmap phasée. |

---

### Synthèse Rapide des Critères d'Évaluation du Challenge

1. **Inclusion & Accessibilité (WCAG 2.1 AAA)** :
   * Contraste visuel maximal et police agrandie sans casse d'interface.
   * Navigation pictographique universelle pour les personnes non scolarisées.
   * Synthèse vocale interactive disponible en langues nationales béninoises (**Fon, Yoruba, Bariba, Dendi, Mina/Goun**).
   * Sous-titres et langage des signes béninois (LSB) pour les personnes malentendantes.

2. **Connectivité Limitée & Mode Hors-Ligne (Offline-First)** :
   * Fonctionnement autonome de la saisie clinique et de la consultation du dossier médical local sans accès internet.
   * Synchronisation en arrière-plan (Background Sync & CRDT) dès le rétablissement de la connexion 2G/3G/4G.
   * Bundle web ultra-léger (< 150 Ko) optimisé pour les smartphones d'entrée de gamme.

3. **Ancrage Institutionnel & Écosystème Béninois** :
   * Alignement avec l'Identifiant Personnel (NPI / ANIP).
   * Interconnexion avec le régime d'Assurance Maladie Universelle (ARCH / AMU).
   * Intégration des paiements Mobile Money locaux (**MTN MoMo, Moov Flooz, Celtiis Cash**).
   * Cartographie des pharmacies de garde et déclaration obligatoire des épidémies vers l'ANSSP et le Ministère de la Santé.
