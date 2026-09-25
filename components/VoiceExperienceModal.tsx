'use client';

import React, { useState } from 'react';

interface VoiceExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLang?: string;
}

interface AudioGuide {
  lang: string;
  name: string;
  flag: string;
  sampleText: string;
  phoneticDescription: string;
  actionGuide: string;
}

const nationalVoiceGuides: Record<string, AudioGuide> = {
  fon: {
    lang: 'fon',
    name: 'Fon (Fɔ̀ngbè)',
    flag: '🇧🇯',
    sampleText: 'Kú àbɔ̀ wá Care.bj jí. A sixú mɔ dotoxwé e ɖò zànjí lɛ, amasin e a na nù lɛ, kpo doto towe kpo gbɔn fífá mɛ.',
    phoneticDescription: 'Koo ah-boh wah Care.bj jee. Ah see-khoo moh doh-toh-hway...',
    actionGuide: 'Zìn kɔ́mú e ɖò glɔ́ é jí bá sè linlin towe (Appuyez sur le micro pour parler).'
  },
  yoruba: {
    lang: 'yoruba',
    name: 'Yorùbá',
    flag: '🇧🇯',
    sampleText: 'Ẹ kú àbọ̀ sí Care.bj. O le wo àwọn àjẹsára rẹ, wá ilé-ìtọ́jú egbòogi, tàbí bá dọ́kítà sọ̀rọ̀ ní kíákíá.',
    phoneticDescription: 'Eh koo ah-boh see Care.bj. Oh leh woh ah-wohn ah-jeh-sah-rah...',
    actionGuide: 'Tẹ bọ́tìnnì yìí láti gbọ́ àlàyé nípa ìlera rẹ.'
  },
  bariba: {
    lang: 'bariba',
    name: 'Baatonum (Bariba)',
    flag: '🇧🇯',
    sampleText: 'Bɛɛ kɔbɔ Care.bj sɔɔ. A koo kpĩ a dɔkɔtɔ kɔmbusi wa, teeru baa nɔɔ kpɛɛkuru.',
    phoneticDescription: 'Beh-eh koh-boh Care.bj soh-oh. Ah koh peen ah doh-koh-toh...',
    actionGuide: 'A koo nɛɛra gɔbisi sɔɔ ka swaa wura.'
  },
  dendi: {
    lang: 'dendi',
    name: 'Dendi',
    flag: '🇧🇯',
    sampleText: 'Kubani Care.bj ra. War ga hin ka di lokotoro jine, safaree ka kani nda cawari jine.',
    phoneticDescription: 'Koo-bah-nee Care.bj rah. War gah heen kah dee...',
    actionGuide: 'Koy jine nda hanga ciine teeri.'
  },
  fr: {
    lang: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    sampleText: 'Bienvenue sur Care.bj. Consultez votre carnet vaccinal, localisez les pharmacies de garde et contactez un médecin sans barrière.',
    phoneticDescription: 'Guidage vocal fluide en français standard.',
    actionGuide: 'Cliquez sur les pictogrammes pour écouter la posologie de vos ordonnances.'
  }
};

export default function VoiceExperienceModal({
  isOpen,
  onClose,
  initialLang = 'fon'
}: VoiceExperienceModalProps) {
  const [selectedLang, setSelectedLang] = useState<string>(initialLang);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<string>('');

  if (!isOpen) return null;

  const currentGuide = nationalVoiceGuides[selectedLang] || nationalVoiceGuides.fr;

  const handlePlayVoice = (text: string) => {
    if (typeof window === 'undefined') return;

    // Si déjà en cours, arrêter
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setActiveSpeech(text);

    // Utilisation de Web Speech Synthesis API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Rythme posé pour bonne compréhension
      utterance.pitch = 1.0;

      // Voix française ou par défaut
      if (selectedLang === 'fr') {
        utterance.lang = 'fr-FR';
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer simulation
      setTimeout(() => {
        setIsPlaying(false);
      }, 4000);
    }
  };

  const handlePictogramClick = (category: string) => {
    let message = "";
    if (category === "vaccin") {
      message = selectedLang === 'fon' 
        ? "Gbɛ́nɔ́gán: Dotóxó vǐ towe tɔn ɖò tɛn tɔn mɛ. Azǎn e bɔdó é wɛ nyí azǎn gban nùkún wè."
        : "Carnet vaccinal: Votre enfant a reçu le Pentavalent. Prochain rappel dans 3 semaines.";
    } else if (category === "ordonnance") {
      message = selectedLang === 'fon' 
        ? "Amasin: Nù nùɖó ɖokpó zǎnzǎn bɔ nù nùɖó ɖokpó gbadanu hwenu e a ɖù nù fó é."
        : "Ordonnance: Prendre un comprimé le matin et un le soir après le repas pendant 5 jours.";
    } else if (category === "pharmacie") {
      message = selectedLang === 'fon' 
        ? "Dotoxwé amasin tɔn: Amasin e a ba é ɖò Pharmacie Camp Guézo Cotonou."
        : "Pharmacie: Votre médicament est disponible à la Pharmacie Camp Guézo à Cotonou.";
    }
    handlePlayVoice(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* En-tête modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xl">
              🎙️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Assistance Vocale en Langues Nationales
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inclusion totale pour les personnes non-alphabétisées ou malvoyantes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Sélecteur de langues locales sous forme de badges tactiles */}
        <div className="my-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Choisissez la langue d&apos;écoute :
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(nationalVoiceGuides).map(([code, item]) => (
              <button
                key={code}
                onClick={() => {
                  if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
                  setIsPlaying(false);
                  setSelectedLang(code);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  selectedLang === code
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md font-bold scale-102'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                <span className="text-xl mb-0.5">{item.flag}</span>
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lecteur audio interactif */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 text-center">
          <div className="flex items-center justify-center gap-1.5 h-8 mb-3">
            <span className={`w-1.5 bg-teal-500 rounded-full transition-all ${isPlaying ? 'audio-bar-1' : 'h-1.5'}`}></span>
            <span className={`w-1.5 bg-teal-600 rounded-full transition-all ${isPlaying ? 'audio-bar-2' : 'h-3'}`}></span>
            <span className={`w-1.5 bg-teal-500 rounded-full transition-all ${isPlaying ? 'audio-bar-3' : 'h-1.5'}`}></span>
            <span className={`w-1.5 bg-teal-400 rounded-full transition-all ${isPlaying ? 'audio-bar-2' : 'h-2'}`}></span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white italic mb-2">
            &ldquo;{activeSpeech || currentGuide.sampleText}&rdquo;
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {currentGuide.actionGuide}
          </p>

          <button
            onClick={() => handlePlayVoice(currentGuide.sampleText)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all ${
              isPlaying 
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <span>{isPlaying ? '⏸️ Arrêter la lecture' : '▶️ Écouter le message audio'}</span>
          </button>
        </div>

        {/* Pictogrammes Médicaux Universels (Test tactile) */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Guide Pictographique Interactif (Touchez pour écouter l&apos;explication) :
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handlePictogramClick('vaccin')}
              className="flex flex-col items-center p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-teal-100 transition-colors"
            >
              <span className="text-3xl mb-1">💉</span>
              <span className="text-xs font-bold">Vaccin</span>
            </button>
            <button
              onClick={() => handlePictogramClick('ordonnance')}
              className="flex flex-col items-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors"
            >
              <span className="text-3xl mb-1">💊</span>
              <span className="text-xs font-bold">Médicament</span>
            </button>
            <button
              onClick={() => handlePictogramClick('pharmacie')}
              className="flex flex-col items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 hover:bg-blue-100 transition-colors"
            >
              <span className="text-3xl mb-1">🏥</span>
              <span className="text-xs font-bold">Pharmacie</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
