"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Calendar, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert, 
  ChevronDown, 
  Mic, 
  MicOff,
  Languages
} from "lucide-react";

interface ChatAction {
  label: string;
  type: "link" | "call" | "action";
  target: string;
  variant?: "primary" | "danger" | "secondary";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  severity?: "normal" | "moderate" | "emergency";
  actions?: ChatAction[];
  quickReplies?: string[];
  timestamp: string;
}

interface ISpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: ISpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export default function HealthAssistantChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lang, setLang] = useState<"fr" | "fon">("fr");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hasUnreadAlert, setHasUnreadAlert] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // Message de bienvenue initial
  const initialGreeting = lang === "fon" 
    ? "Kouabo nǔ we ! Un nyí CareBot, alɔgɔ́tɔ́ towe nú lanmɛ na nɔ ganji tɔn ɖo Bénin. Nɛ̌ un ka sixu d'alɔ we gbɔn égbé ?"
    : "Bonjour ! Je suis CareBot, l'assistant santé souverain du Bénin 🇧🇯. Je peux vous aider à évaluer vos symptômes, prendre un rendez-vous au CNHU ou trouver une pharmacie de garde. Comment vous sentez-vous ?";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: initialGreeting,
      severity: "normal",
      quickReplies: [
        "J'ai de la fièvre et des courbatures",
        "Comment prendre un rendez-vous ?",
        "Pharmacies de garde à Cotonou",
        "Comment avoir ma carte ANIP ?"
      ],
      actions: [
        {
          label: "📅 Prendre un Rendez-vous",
          type: "link",
          target: "/dashboard#appointments",
          variant: "primary"
        }
      ],
      timestamp: new Date().toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Scroll automatique au dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Initialisation de la reconnaissance vocale si supportée
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => ISpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
      };
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang === "fon" ? "fr-FR" : "fr-FR"; // Support fallback
        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            setInputMessage(transcript);
          }
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  // Vocalisation TTS du message (Web Speech API)
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Nettoyage des balises markdown
    const cleanText = text
      .replace(/[#*`_~]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          lang: lang,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error("Erreur de communication avec l'assistant.");

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        severity: data.severity,
        actions: data.suggestedActions,
        quickReplies: data.quickReplies,
        timestamp: new Date().toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);

      if (audioEnabled) {
        speakText(data.reply);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: "Désolé, une petite anomalie réseau est survenue. Pour toute urgence immédiate, veuillez composer directement le 112.",
          severity: "emergency",
          actions: [
            {
              label: "📞 Appeler le 112 (SAMU)",
              type: "call",
              target: "tel:112",
              variant: "danger"
            }
          ],
          timestamp: new Date().toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: initialGreeting,
        severity: "normal",
        quickReplies: [
          "J'ai de la fièvre et des courbatures",
          "Comment prendre un rendez-vous ?",
          "Pharmacies de garde à Cotonou",
          "Comment avoir ma carte ANIP ?"
        ],
        actions: [
          {
            label: "📅 Prendre un Rendez-vous",
            type: "link",
            target: "/dashboard#appointments",
            variant: "primary"
          }
        ],
        timestamp: new Date().toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const switchLanguage = (newLang: "fr" | "fon") => {
    setLang(newLang);
    handleSendMessage(newLang === "fon" ? "Parler en langue Fon" : "Repasser en français");
  };

  return (
    <>
      {/* 1. Bouton Flottant Déclencheur en Bas à Droite */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        
        {/* Infobulle d'invitation discrète */}
        {!isOpen && hasUnreadAlert && (
          <div 
            onClick={() => {
              setIsOpen(true);
              setHasUnreadAlert(false);
            }}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 shadow-xl shadow-teal-950/10 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:scale-105 transition-all animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Besoin d&apos;orientation santé ? <strong>CareBot est disponible 24/7</strong> 🇧🇯</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadAlert(false);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bouton Rond Principal */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
            setHasUnreadAlert(false);
          }}
          aria-label="Ouvrir l'assistant santé CareBot"
          className="relative group p-4 rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-2xl shadow-teal-700/40 hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-teal-400/40"
        >
          {isOpen ? (
            <X className="w-7 h-7 transition-transform rotate-0 group-hover:rotate-90" />
          ) : (
            <>
              <Bot className="w-7 h-7 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* 2. Fenêtre Modale / Popover Interactive de l'Assistant */}
      {isOpen && (
        <div 
          className={`fixed bottom-24 right-4 sm:right-6 z-40 w-[94vw] sm:w-[420px] max-w-[420px] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-teal-950/25 flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? "h-16" : "h-[620px] max-h-[82vh]"
          }`}
        >
          {/* Header de la fenêtre */}
          <div className="p-4 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-teal-700/40">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <Bot className="w-5 h-5 text-teal-300" />
                <span className="absolute -bottom-1 -right-1 text-[10px]">🇧🇯</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white tracking-wide">CareBot Bénin</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold">
                    IA Frugale
                  </span>
                </div>
                <p className="text-[11px] text-teal-200 font-medium">Orientation médicale & Triage 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sélecteur de langue */}
              <button
                onClick={() => switchLanguage(lang === "fr" ? "fon" : "fr")}
                className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-colors flex items-center gap-1"
                title="Changer de langue (Français / Fon)"
              >
                <Languages className="w-3.5 h-3.5 text-teal-300" />
                <span>{lang.toUpperCase()}</span>
              </button>

              {/* Mute / Unmute TTS */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setAudioEnabled(!audioEnabled);
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  audioEnabled ? "bg-teal-500 text-white" : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
                title={audioEnabled ? "Vocalisation automatique activée" : "Activer la lecture vocale"}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Réinitialiser la discussion */}
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                title="Nouvelle conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Minimiser / Agrandir */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                title={isMinimized ? "Agrandir" : "Réduire"}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Corps des messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                
                {/* Avertissement déontologique & souveraineté */}
                <div className="p-2.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 text-[10px] text-teal-900 dark:text-teal-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    CareBot fournit un pré-triage indicatif selon les recommandations de santé publique du Bénin. Ne remplace pas un médecin. En cas d&apos;urgence vitale, composez le <strong>112</strong>.
                  </p>
                </div>

                {messages.map((msg) => {
                  const isBot = msg.role === "assistant";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? "items-start" : "items-end"} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                        <span>{isBot ? "CareBot Bénin" : "Vous"}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                          isBot
                            ? "bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200/70 dark:border-slate-700/70 shadow-xs"
                            : "bg-teal-600 text-white rounded-tr-sm shadow-md shadow-teal-600/20 font-medium"
                        }`}
                      >
                        {/* Indicateur de gravité si présent */}
                        {isBot && msg.severity === "emergency" && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white mb-2 animate-pulse">
                            <span>🚨 Urgence Vitale (Code Rouge)</span>
                          </div>
                        )}
                        {isBot && msg.severity === "moderate" && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white mb-2">
                            <span>⚠️ Consultation Recommandée (Code Jaune)</span>
                          </div>
                        )}

                        {/* Rendu du texte avec formatage simple des sauts de ligne et gras */}
                        <div className="space-y-1.5 whitespace-pre-wrap">
                          {msg.content}
                        </div>

                        {/* Bouton de lecture audio TTS pour ce message */}
                        {isBot && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                            <button
                              onClick={() => speakText(msg.content)}
                              className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline font-bold"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isSpeaking ? "Arrêter la lecture" : "Écouter la réponse"}</span>
                            </button>
                          </div>
                        )}

                        {/* Boutons d'actions contextuelles suggérées */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                            {msg.actions.map((act, aIdx) => {
                              const isEmergencyCall = act.type === "call";
                              return (
                                <a
                                  key={aIdx}
                                  href={act.target}
                                  onClick={() => {
                                    if (act.target.startsWith("#") || act.target.startsWith("/dashboard")) {
                                      setIsOpen(false);
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                    act.variant === "danger"
                                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 animate-bounce"
                                      : act.variant === "secondary"
                                      ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300"
                                      : "bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20"
                                  }`}
                                >
                                  {isEmergencyCall ? <PhoneCall className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                                  <span>{act.label}</span>
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 w-fit">
                    <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
                    <span className="text-xs font-medium">CareBot analyse vos symptômes...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions rapides en 1-clic (Quick Replies) */}
              {messages.length > 0 && messages[messages.length - 1].quickReplies && (
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  {messages[messages.length - 1].quickReplies!.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      onClick={() => handleSendMessage(reply)}
                      disabled={isLoading}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-900 text-slate-700 dark:text-slate-200 text-[11px] font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors shadow-2xs shrink-0"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Formulaire de saisie utilisateur */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleVoiceListening}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isListening
                        ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                    title={isListening ? "Arrêter la dictée" : "Parler dans le micro (Vocal)"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      isListening 
                        ? "Écoute en cours..." 
                        : lang === "fon" 
                        ? "Kanbyɔ́ nǔɖe ɖo fǐ..." 
                        : "Posez votre question de santé..."
                    }
                    disabled={isLoading}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-teal-600/20 active:scale-95 shrink-0"
                    aria-label="Envoyer le message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>Souveraineté des données • APDP Bénin</span>
                  <a href="tel:112" className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
                    SAMU : 112
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
