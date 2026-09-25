'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import QuickEmergencyBar from '@/components/QuickEmergencyBar';
import Hero from '@/components/Hero';
import InteractiveEcosystem from '@/components/InteractiveEcosystem';
import InclusionSection from '@/components/InclusionSection';
import SpecificationsViewer from '@/components/SpecificationsViewer';
import Footer from '@/components/Footer';
import VoiceExperienceModal from '@/components/VoiceExperienceModal';
import AuthModal from '@/components/AuthModal';
import { SupportedLang } from '@/lib/translations';

interface UserSession {
  name: string;
  role: string;
  id: string;
}

export default function Home() {
  const [currentLang, setCurrentLang] = useState<SupportedLang>('fr');
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-teal-500 selection:text-white">
      {/* 1. Barre de Navigation avec sélecteur de langues locales & statut réseau internet */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onToggleVoiceModal={() => setVoiceModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* 2. Barre d'Urgence Immédiate SAMU Bénin 112 */}
      <QuickEmergencyBar currentLang={currentLang} />

      {/* 3. Section Hero d'accueil & Impact */}
      <main className="flex-1">
        <Hero
          currentLang={currentLang}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        {/* 4. Écosystème Interactif traduit (DMP, Pharmacies de garde, Téléexpertise, Épidémies) */}
        <InteractiveEcosystem currentLang={currentLang} />

        {/* 5. Section Dédiée à l'Inclusion & Accessibilité (WCAG AAA, Vocal, Offline) traduite */}
        <InclusionSection
          currentLang={currentLang}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
        />

        {/* 6. Vue sur le Dossier Complet de Spécifications Logicielles */}
        <SpecificationsViewer />
      </main>

      {/* 7. Pied de page Institutionnel Républicain traduit */}
      <Footer currentLang={currentLang} />

      {/* 8. Modal Interactif d'Assistance Vocale en Langues Nationales */}
      <VoiceExperienceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        initialLang={currentLang}
      />

      {/* 9. Modal de Connexion / Espace Santé Sécurisé (NPI, Médecin, Pharmacie) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
