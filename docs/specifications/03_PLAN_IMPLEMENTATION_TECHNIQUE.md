# PLAN D'IMPLÉMENTATION TECHNIQUE DE BOUT EN BOUT
## Plateforme e-Santé Bénin (Care.bj) : Architecture, Sécurité, DevOps & Déploiement

---

## 1. ARCHITECTURE SYSTÈME CIBLE & STACK TECHNIQUE

### 1.1 Diagramme d'Architecture Globale (C4 Model - Conteneurs)

```
+-----------------------------------------------------------------------------------+
|                            CLIENTS & CANAUX D'ACCÈS                               |
|                                                                                   |
|  [ Citoyen / Patient ]    [ Soignant / Infirmier ]    [ Pharmacien / Biologiste ] |
|  - WebApp / PWA Offline   - Tablette Santé Rurale     - Poste Fixe Officine       |
|  - Synthèse Vocale (Fon)  - Mode Forain Déconnecté    - Lecteur Barcode/QR        |
|  - Téléphone basique USSD - App Mobile React 19       - Export PDF / HL7          |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / WSS / WebRTC (TLS 1.3)
                                           v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY & SÉCURITÉ PÉRIMÉTRIQUE                        |
|  - Reverse Proxy Traefik / NGINX Ingress Controller                               |
|  - WAF (Web Application Firewall) + Rate Limiting anti-DDoS                       |
|  - Terminaison TLS 1.3 avec Cert-Manager (Let's Encrypt)                          |
+------------------------------------------+----------------------------------------+
                                           | Requêtes authentifiées (JWT / OAuth2)
                                           v
+-----------------------------------------------------------------------------------+
|                  APPLICATION SERVICES LAYER (Micro-services / Modulaire)           |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | Next.js 16 (App Router)|  | NestJS Core Engine     |  | AI & Voice Engine   |  |
|  | - Frontend SSR / PWA   |  | - FHIR v4 Resources    |  | - Triage local WASM |  |
|  | - Server Actions       |  | - DMP & e-Prescription |  | - Audio Fon/Yoruba  |  |
|  | - Design System AAA    |  | - Workflow Pharmacies  |  | - Symptom Checker   |  |
|  +-----------+------------+  +-----------+------------+  +----------+----------+  |
+--------------|---------------------------|--------------------------|-------------+
               |                           |                          |
               +---------------------------+--------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        PERSISTANCE & INFRASTRUCTURE DONNÉES                       |
|                                                                                   |
|  +---------------------+  +---------------------+  +---------------------------+  |
|  | PostgreSQL 16       |  | Redis 7 (Cluster)   |  | MinIO S3 Object Storage   |  |
|  | - Extension PostGIS |  | - Cache de session  |  | - Radios & Imagerie DICOM |  |
|  | - Chiffrement pgcrypto | - Files BullMQ       |  | - Ordonnances signées PDF |  |
|  | - Row Level Security|  | - Broker Pub/Sub    |  | - Pièces jointes chiffrées|  |
|  +---------------------+  +---------------------+  +---------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 1.2 Justification des Choix Technologiques

| Composant | Technologie Choisie | Rationale & Alignement avec le Contexte Béninois |
| :--- | :--- | :--- |
| **Framework Web / PWA** | **Next.js 16 (React 19) + TypeScript** | Performances extrêmes, rendu hybride (SSR pour SEO/découvrabilité et Client-side pour interactivité PWA hors-ligne). |
| **Styling & Design System** | **Tailwind CSS v4 & CSS Variables sémantiques** | Contrôle granulaire du contraste WCAG 2.1 AAA, poids CSS minime (< 15 Ko gzip), support natif Dark/Light/High-Contrast. |
| **Offline-First & Local DB** | **Workbox (Service Worker) + IndexedDB (Dexie.js)** | Permet la poursuite de 100% des saisies de consultation dans les zones rurales béninoises sans accès internet. |
| **Serveur Backend / API** | **Node.js / Fastify & NestJS** | I/O asynchrone non-bloquant très véloce, architecture modulaire typée TypeScript, standard HL7 FHIR v4 natif. |
| **Base de Données Principale** | **PostgreSQL 16 + PostGIS** | Fiabilité ACID absolue, robustesse reconnue, support géographique géospatial natif (recherche de proximité pharmacies/hôpitaux). |
| **Cache & Files d'attente** | **Redis 7 & BullMQ** | Gestion des pics de trafic, exécution asynchrone des envois d'alertes SMS/WhatsApp et calculs épidémiologiques lourds. |
| **Stockage Fichiers Médicaux** | **MinIO (Chiffrement AES-256)** | Stockage objet auto-hébergable compatible S3 pour garantir la souveraineté numérique béninoise sans dépendance cloud propriétaire étrangère. |

---

## 2. STANDARDS DE CODE & GOUVERNANCE TECHNIQUE

### 2.1 Conventions & Qualité de Code
* **Typage Stricte** : `strict: true` activé dans `tsconfig.json`. L'utilisation du type `any` est interdite (rejetée par le linter).
* **Architecture Hexagonale / Clean Architecture** : Séparation stricte entre les couches :
  1. *Domain* (Entités et règles métier pures, indépendantes de tout framework).
  2. *Application / Use Cases* (Orchestration des flux métiers).
  3. *Infrastructure* (Adapteurs de base de données, passerelles SMS, API externes).
  4. *Presentation* (Contrôleurs, composants UI React).
* **Git Workflow & Conventional Commits** :
  * Format de commit obligatoire : `type(scope): description concise` (ex: `feat(prescription): add drug interaction validator`).
  * Branches : `main` (Production), `develop` (Intégration), `feature/xxx` (Développement de fonctionnalité), `fix/xxx` (Correction de bug).
  * Automatisation via **Husky** et **lint-staged** sur le hook `pre-commit` (vérification de lint, formatting et tests unitaires de non-régression).

---

## 3. SÉCURITÉ, CONFIDENTIALITÉ & CONFORMITÉ LÉGALE (APDP BÉNIN)

### 3.1 Cadre Réglementaire Local & International
* **Conformité APDP (Autorité de Protection des Données Personnelles du Bénin)** : Respect rigoureux de la loi béninoise portant Code du Numérique (Livre V sur la protection des données à caractère personnel).
* **Conformité HDS (Hébergement de Données de Santé)** et principes fondamentaux du RGPD (Minimisation des données, droit à l'oubli, transparence des traitements).

### 3.2 Mesures Techniques de Sécurité Implémentées

```
                                      ARCHITECTURE DE SÉCURITÉ
                                      
  [ Client Browser / PWA ] 
             |
             | TLS 1.3 (HTTPS) - Strict-Transport-Security (HSTS)
             v
  [ API Gateway ] --------> Rate Limiter : 100 req/min par IP / 10 req/min sur /auth
             |
             +------------> Content Security Policy (CSP) stricte (anti-XSS)
             |
             v
  [ Authentification ] ---> JWT asymétrique Ed25519 (durée de vie 15 minutes)
                            + Refresh Token rotatif stocké en cookie HttpOnly / SameSite=Strict
             |
             v
  [ Base de Données ] ----> Chiffrement Transparent au repos (AES-256)
                            + Row-Level Security (RLS) : un médecin ne voit que ses patients
                            + Anonymisation automatique sur les exports statistiques
```

* **Traçabilité Immuable (Audit Trail)** : Chaque lecture ou écriture d'une donnée médicale est consignée dans un journal d'audit append-only contenant : Horodatage UTC, ID du praticien, ID du patient accédé, adresse IP hachée, motif d'accès.
* **Fonction "Bris de Glace" Auditée** : En cas d'urgence vitale, l'accès forcé sans consentement préalable déclenche immédiatement un webhook d'audit et l'envoi d'un SMS au patient.

---

## 4. CONTENEURISATION & ENVIRONNEMENT DOCKER

### 4.1 Dockerfile Multi-Stage Optimisé (Production Ready)

Fichier de build de l'application Next.js 16 réduisant la taille de l'image de 1.2 Go à moins de **95 Mo** :

```dockerfile
# Étape 1 : Dépendances
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Étape 2 : Build applicatif
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Étape 3 : Image d'exécution minimale non-root
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Sécurité : Exécution sous utilisateur non-privilégié
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### 4.2 Orchestration Docker Compose Locale (`docker-compose.yml`)

Permet de lancer l'intégralité de l'écosystème en local en une seule commande (`docker compose up -d`) :

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: healthy_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://care_user:care_secure_pass@db:5432/care_bj_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=change_this_to_a_super_secure_random_key_for_prod
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgis/postgis:16-3.4-alpine
    container_name: healthy_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: care_user
      POSTGRES_PASSWORD: care_secure_pass
      POSTGRES_DB: care_bj_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U care_user -d care_bj_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: healthy_redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data
    ports:
      - "6379:6379"

volumes:
  pgdata:
  redisdata:
```

---

## 5. PIPELINE CI/CD (GITHUB ACTIONS)

Configuration du pipeline d'automatisation continue (`.github/workflows/ci-cd.yml`) :

```yaml
name: CI/CD Pipeline - e-Santé Bénin

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-check:
    name: 1. Qualité, Lint & Types
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: TypeScript Check
        run: npx tsc --noEmit
      - name: ESLint Check
        run: npm run lint

  security-scan:
    name: 2. Scan Vulnérabilités & SAST
    needs: quality-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Security Audit Dependencies
        run: npm audit --audit-level=high
      - name: Run Trivy FS Scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'

  automated-tests:
    name: 3. Tests Unitaires & Accessibilité
    needs: quality-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - name: Run Unit Tests (Coverage > 85%)
        run: npm test -- --coverage
      - name: Run Accessibility Audit (pa11y / axe-core)
        run: npx pa11y-ci

  docker-build-push:
    name: 4. Build Conteneur & Push Registry
    needs: [security-scan, automated-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest,ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-production:
    name: 5. Déploiement Cloud Sécurisé
    needs: docker-build-push
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Déploiement via Webhook sécurisé / GitOps ArgoCD
        run: |
          echo "Déclenchement du rolling-update de production sur cluster Kubernetes..."
          # curl -X POST ${{ secrets.DEPLOY_WEBHOOK_URL }} -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}"
```

---

## 6. STRATÉGIE DE TEST & ASSURANCE QUALITÉ

### 6.1 Pyramide des Tests

```
                  / \
                 /   \
                / E2E \          Playwright (10% des tests)
               /-------\         Parcours complets : Inscription -> Consultation -> Ordonnance
              /         \
             / Intégration\      Supertest & Testcontainers (25% des tests)
            /---------------\    Vérification API FHIR, Postgres RLS, Redis Queues
           /                 \
          /   Tests Unitaires \  Vitest / Jest (65% des tests)
         /---------------------\ Calcul posologique, Règles métier, Contraste WCAG AAA
```

### 6.2 Tests Spécifiques Obligatoires
1. **Tests d'Accessibilité (A11y)** :
   * Automatisation avec `jest-axe` sur chaque composant UI.
   * Règle bloquante en CI : Zéro violation critique WCAG 2.1 AA/AAA.
2. **Tests de Résilience Réseau & Hors-Ligne (Network Throttling)** :
   * Simulation Playwright en profil réseau "Slow 2G" (50 kbps, 500ms RTT) et "Completely Offline".
   * Validation que les consultations rédigées hors-ligne sont conservées sans aucune perte de données.
3. **Tests de Charge & Performance (k6)** :
   * Simulation d'une pointe de 5 000 utilisateurs concurrents (campagne de vaccination nationale ou urgence épidémique).
   * Seuil de succès : Temps de réponse P95 < 300 ms, taux d'erreur < 0.1%.

---

## 7. OBSERVABILITÉ, LOGS & MONITORING EN PRODUCTION

* **Métriques Système & Métier (Prometheus + Grafana)** :
  * Disponibilité globale du service (SLA cible : **99.95%**).
  * Débit des requêtes par seconde (RPS) et latence P50 / P95 / P99.
  * Taux de consultations complétées avec succès et volume d'ordonnances émises.
* **Logging Centralisé (OpenTelemetry + Loki)** :
  * Format de log JSON normalisé avec masquage automatique des identifiants nominatifs et données de santé.
* **Surveillance des Erreurs (Sentry)** :
  * Capture des erreurs front-end et back-end avec stacktrace désobfusquée et contexte de connectivité réseau.
* **Plan de Sauvegarde & Reprise d'Activité (PRA / PCA)** :
  * Sauvegarde continue des logs WAL PostgreSQL vers stockage distant chiffré.
  * Dump quotidien complet automatique avec rétention chiffrée sur 30 jours glissants (RPO < 15 min, RTO < 1h).

---

## 8. FEUILLE DE ROUTE D'IMPLÉMENTATION CHRONOLOGIQUE

```
+-----------------------------------------------------------------------------------------+
|                                 FEUILLE DE ROUTE CARE.BJ                                |
+-----------------------------------------------------------------------------------------+

[ SPRINT 0 : CHALLENGE E-SANTÉ (3 Jours) ]
- Initialisation du socle Next.js 16 / TypeScript / PWA
- Interface inclusive WCAG AAA & Navigation pictographique
- Synthèse vocale multilingue de base (Français, Fon, Yoruba)
- Fiche patient simplifiée avec QR Code d'urgence offline
- Déploiement en ligne et démonstrateur interactif testable en direct

[ PHASE 1 : PILOTE OPÉRATIONNEL (Mois 1 à 3) ]
- Intégration de la base de données PostgreSQL + RLS & Redis
- Authentification OTP SMS et liaison d'enrôlement NPI (ANIP)
- Module de téléexpertise asynchrone pour 10 dispensaires pilotes
- Tests de charge et audit de sécurité formel par l'APDP Bénin

[ PHASE 2 : ÉCOSYSTÈME PHARMACIE & URGENCES (Mois 4 à 6) ]
- Déploiement du module e-Prescription sécurisé et QR de délivrance
- Connexion aux officines de pharmacie pour les stocks de garde
- Module de gestion des lits hospitaliers et régulation SAMU Bénin
- Intégration de la passerelle de paiement Mobile Money (MoMo / Flooz / Celtiis)

[ PHASE 3 : GÉNÉRALISATION NATIONALE & MINISTÈRE (Mois 7 à 12) ]
- Déploiement à l'échelle des 12 départements et 77 communes du Bénin
- Raccordement définitif avec le régime ARCH / AMU
- Tableaux de bord de surveillance épidémiologique pour l'ANSSP et le Ministère
- Triage par IA frugale embarquée et monitoring IoT de la chaîne du froid vaccinale
```
