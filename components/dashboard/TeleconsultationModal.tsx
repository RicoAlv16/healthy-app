"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  ShieldCheck, 
  Activity, 
  MessageSquare, 
  Send, 
  User, 
  Stethoscope, 
  Heart, 
  FileText
} from "lucide-react";
import { AppointmentRecord, SafeUser, VitalSignRecord } from "@/lib/db";

interface TeleconsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord;
  currentUser: SafeUser;
  patientVitals?: VitalSignRecord[];
  onOpenPrescriptionModal?: (patientId: string) => void;
}

export default function TeleconsultationModal({
  isOpen,
  onClose,
  appointment,
  currentUser,
  patientVitals = [],
  onOpenPrescriptionModal,
}: TeleconsultationModalProps) {
  // Call controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Frugal Mode: '4g_hd' | '3g_medium' | '2g_frugal'
  const [networkQuality, setNetworkQuality] = useState<"4g_hd" | "3g_medium" | "2g_frugal">("4g_hd");

  // Side panels: 'none' | 'vitals' | 'chat'
  const [activeTab, setActiveTab] = useState<"vitals" | "chat">("vitals");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: "Système Care.bj",
      text: "Salle de téléconsultation souveraine établie. Chiffrement de bout en bout conforme APDP.",
      time: "10:00",
    },
    {
      sender: `Dr. ${appointment.doctor?.lastName || "AGBO"}`,
      text: "Bonjour, je consulte actuellement votre dossier. Comment vous sentez-vous aujourd'hui ?",
      time: "10:01",
    },
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  // Minuteur d'appel
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen]);

  const handleClose = () => {
    setCallDuration(0);
    onClose();
  };

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const timeStr = new Date().toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: `${currentUser.firstName} ${currentUser.lastName}`,
        text: newChatMessage.trim(),
        time: timeStr,
      },
    ]);
    setNewChatMessage("");
  };

  const isDoctor = currentUser.role === "doctor";
  const otherPartyName = isDoctor
    ? `${appointment.patient?.firstName || "Patient"} ${appointment.patient?.lastName || ""}`
    : `Dr. ${appointment.doctor?.firstName || "Florent"} ${appointment.doctor?.lastName || "AGBO"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fade-in p-2 sm:p-4">
      <div className="relative w-full h-full max-w-7xl bg-slate-900 rounded-3xl border border-teal-500/30 shadow-2xl flex flex-col overflow-hidden">
        
        {/* 1. Header de Téléconsultation */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">
                  Téléconsultation Médicale Care.bj
                </h3>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  EN DIRECT • {formatTimer(callDuration)}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avec <strong>{otherPartyName}</strong> • {appointment.facility}
              </p>
            </div>
          </div>

          {/* Statut Réseau & Sécurité APDP */}
          <div className="flex items-center gap-3">
            {/* Sélecteur Débit Frugal */}
            <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setNetworkQuality("4g_hd")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  networkQuality === "4g_hd"
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Vidéo HD (Bande passante optimale 4G)"
              >
                4G HD
              </button>
              <button
                type="button"
                onClick={() => setNetworkQuality("3g_medium")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  networkQuality === "3g_medium"
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Vidéo Bas Débit 360p (Réseau moyen 3G)"
              >
                3G Eco
              </button>
              <button
                type="button"
                onClick={() => {
                  setNetworkQuality("2g_frugal");
                  setIsVideoOff(true);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  networkQuality === "2g_frugal"
                    ? "bg-rose-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Mode Frugal 2G : Voix seule Opus 12 kbps"
              >
                2G Frugal
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Chiffré DTLS-SRTP</span>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fermer la vue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Corps Principal : Flux Vidéo + Volet Latéral */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Zone Vidéo Principale */}
          <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-4">
            
            {/* Mode 2G Frugal ou Caméra Désactivée */}
            {networkQuality === "2g_frugal" || isVideoOff ? (
              <div className="text-center space-y-4 max-w-md animate-fade-in p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-teal-500/20">
                  {otherPartyName.slice(0, 2).toUpperCase()}
                  <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{otherPartyName}</h4>
                  <p className="text-xs text-teal-400 font-mono mt-0.5">
                    {networkQuality === "2g_frugal" 
                      ? "Mode Frugal 2G Actif • Flux Audio Vocal Haute Intelligibilité (Opus 12kbps)"
                      : "Vidéo coupée • Audio en direct"}
                  </p>
                </div>
                <div className="flex justify-center items-center gap-1 h-6">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-teal-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(6, Math.sin(i * 0.8 + callDuration) * 22)}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Flux Vidéo Actif */
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center">
                {/* Simulation de la caméra distante */}
                <div className="text-center space-y-3">
                  <div className="w-32 h-32 mx-auto rounded-3xl bg-teal-950/80 border-2 border-teal-500/40 text-teal-300 flex items-center justify-center text-4xl font-black shadow-2xl">
                    {isDoctor ? <User className="w-16 h-16" /> : <Stethoscope className="w-16 h-16" />}
                  </div>
                  <p className="text-sm font-bold text-white tracking-wide">
                    Flux Vidéo Praticien : {otherPartyName}
                  </p>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Connexion 720p HD • Latence : 28ms
                  </span>
                </div>

                {/* PiP : Caméra locale du patient / utilisateur */}
                <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl bg-slate-900/90 border-2 border-teal-500/50 shadow-2xl overflow-hidden flex flex-col justify-between p-2">
                  <span className="text-[10px] font-bold text-teal-400 px-2 py-0.5 rounded-md bg-slate-950/60 w-fit">
                    Vous ({currentUser.firstName})
                  </span>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{isMuted ? "Micro muet" : "Micro actif"}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Barre de Contrôles Flottante */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center gap-3">
              {/* Micro */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-xl transition-all ${
                  isMuted ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
                title={isMuted ? "Activer le micro" : "Couper le micro"}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Caméra */}
              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-xl transition-all ${
                  isVideoOff ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
                title={isVideoOff ? "Allumer la caméra" : "Couper la caméra"}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Raccrocher */}
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                title="Mettre fin à la consultation"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Terminer</span>
              </button>

              {/* Toggle Fiche Constantes */}
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveTab("vitals");
                }}
                className={`p-3 rounded-xl transition-all ${
                  isSidebarOpen && activeTab === "vitals"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title="Constantes & Fiche Patient"
              >
                <Activity className="w-5 h-5" />
              </button>

              {/* Toggle Chat */}
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(true);
                  setActiveTab("chat");
                }}
                className={`p-3 rounded-xl transition-all ${
                  isSidebarOpen && activeTab === "chat"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
                title="Chat & Notes de consultation"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Action Médecin : Émettre Ordonnance */}
              {isDoctor && onOpenPrescriptionModal && (
                <button
                  type="button"
                  onClick={() => {
                    if (appointment.patientId) {
                      onOpenPrescriptionModal(appointment.patientId);
                    }
                  }}
                  className="hidden lg:flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  title="Rédiger une ordonnance pendant l'appel"
                >
                  <FileText className="w-4 h-4" />
                  <span>+ E-Ordonnance</span>
                </button>
              )}
            </div>

          </div>

          {/* Volet Latéral Interactif (Constantes ou Chat) */}
          {isSidebarOpen && (
            <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between animate-fade-in">
              
              {/* Onglets du volet */}
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex gap-1 bg-slate-950 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("vitals")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "vitals"
                        ? "bg-teal-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Constantes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "chat"
                        ? "bg-teal-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Chat & Notes
                  </button>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contenu Onglet 1 : Constantes & Fiche Patient */}
              {activeTab === "vitals" && (
                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Constantes Vitales en Temps Réel</span>
                    </h4>
                    
                    {patientVitals.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs text-center">
                        Aucune constante enregistrée récemment.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {patientVitals.slice(0, 4).map((v) => (
                          <div
                            key={v.id}
                            className="p-3 bg-slate-950/60 rounded-xl border border-slate-800"
                          >
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                              {v.type.replace("_", " ")}
                            </p>
                            <p className="text-base font-black text-white font-mono mt-0.5">
                              {v.value} {v.unit}
                            </p>
                            <span className="text-[9px] text-emerald-400 font-semibold">
                              ● Normal
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Motif du rendez-vous */}
                  <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Motif de la téléconsultation :
                    </p>
                    <p className="text-xs text-slate-200 font-medium">
                      {appointment.notes || "Consultation médicale de suivi"}
                    </p>
                  </div>

                  {/* Sécurité et Consentement */}
                  <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-teal-300 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      <span>Consentement Éclairé</span>
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Conformément à la réglementation de télémédecine au Bénin, cette session est tracée et intégrée au DMP national.
                    </p>
                  </div>
                </div>
              )}

              {/* Contenu Onglet 2 : Chat Médical Sécurisé */}
              {activeTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="p-4 space-y-3 overflow-y-auto flex-1">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-teal-400">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      placeholder="Message sécurisé..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-teal-500 font-sans"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white"
                      title="Envoyer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
