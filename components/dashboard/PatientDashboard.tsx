"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { SafeUser, VitalSignRecord, AppointmentRecord, PrescriptionRecord, VaccinationRecord } from "@/lib/db";
import { 
  Heart, 
  Activity, 
  Droplet, 
  Scale, 
  Calendar, 
  FileText, 
  CreditCard, 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  Video, 
  Phone,
  Syringe,
  ShieldCheck,
  X
} from "lucide-react";
import AddVitalSignModal from "./AddVitalSignModal";
import DigitalHealthCardModal from "./DigitalHealthCardModal";
import AddVaccineModal from "./AddVaccineModal";
import BookAppointmentModal from "./BookAppointmentModal";
import TeleconsultationModal from "./TeleconsultationModal";

interface PatientDashboardProps {
  user: SafeUser;
  vitals: VitalSignRecord[];
  appointments: AppointmentRecord[];
  prescriptions: PrescriptionRecord[];
  vaccinations?: VaccinationRecord[];
  onRefresh: () => void;
  isBookAppointmentOpen?: boolean;
  onOpenBookAppointment?: () => void;
  onCloseBookAppointment?: () => void;
}

export default function PatientDashboard({
  user,
  vitals,
  appointments,
  prescriptions,
  vaccinations = [],
  onRefresh,
  isBookAppointmentOpen,
  onOpenBookAppointment,
  onCloseBookAppointment,
}: PatientDashboardProps) {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAddVitalOpen, setIsAddVitalOpen] = useState(false);
  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [internalBookOpen, setInternalBookOpen] = useState(false);
  
  const isBookModalOpen = isBookAppointmentOpen !== undefined ? isBookAppointmentOpen : internalBookOpen;
  const openBookModal = () => {
    if (onOpenBookAppointment) onOpenBookAppointment();
    else setInternalBookOpen(true);
  };
  const closeBookModal = () => {
    if (onCloseBookAppointment) onCloseBookAppointment();
    else setInternalBookOpen(false);
  };

  const [activeTeleconsultation, setActiveTeleconsultation] = useState<AppointmentRecord | null>(null);
  const [bookingAlert, setBookingAlert] = useState<{ appointment: AppointmentRecord; smsAlert: { sentTo: string; message: string } } | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionRecord | null>(null);
  const [prescriptionQrUrl, setPrescriptionQrUrl] = useState<string>("");

  const handleShowPrescriptionQr = async (p: PrescriptionRecord) => {
    setSelectedPrescription(p);
    try {
      const url = await QRCode.toDataURL(p.qrHash, {
        width: 240,
        margin: 2,
        color: { dark: "#0F172A", light: "#FFFFFF" },
      });
      setPrescriptionQrUrl(url);
    } catch (e) {
      console.error("Erreur QR ordonnance:", e);
    }
  };

  // Trouver les dernières mesures par type
  const latestVitals = {
    blood_pressure: vitals.find((v) => v.type === "blood_pressure"),
    glucose: vitals.find((v) => v.type === "glucose"),
    heart_rate: vitals.find((v) => v.type === "heart_rate"),
    weight: vitals.find((v) => v.type === "weight"),
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Bannière d'accueil et Statut ARCH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Assuré ARCH Bénin : {user.archNumber || "ARCH-BJ-2024-8841"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Couverture 100% Soins de Base
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Bonjour, {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Votre dossier médical souverain est synchronisé avec l&apos;ANIP et le réseau hospitalier national du Bénin. Vos constantes sont à jour.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openBookModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-black text-xs shadow-lg shadow-teal-950/40 transition-all active:scale-95 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Prendre un Rendez-vous</span>
            </button>

            <button
              onClick={() => setIsCardModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4 text-teal-700" />
              <span>Ma Carte Numérique & QR</span>
            </button>

            <button
              onClick={() => setIsAddVitalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600/80 hover:bg-teal-500 text-white font-bold text-xs border border-teal-400/30 shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Mesure</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cartes des Constantes Vitales */}
      <div id="vitals" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>Constantes Vitales en Temps Réel</span>
          </h2>
          <span className="text-xs text-slate-500">
            Dernières mesures synchronisées
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tension Artérielle */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
                <Activity className="w-5 h-5" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Normale
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Tension Artérielle</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {latestVitals.blood_pressure?.value || "12/8"}
                </span>
                <span className="text-xs font-bold text-slate-400">mmHg</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{latestVitals.blood_pressure ? new Date(latestVitals.blood_pressure.measuredAt).toLocaleDateString("fr-BJ") : "Récemment"}</span>
            </p>
          </div>

          {/* Glycémie */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <Droplet className="w-5 h-5" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Optimale
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Glycémie à jeun</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {latestVitals.glucose?.value || "0.95"}
                </span>
                <span className="text-xs font-bold text-slate-400">g/L</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{latestVitals.glucose ? new Date(latestVitals.glucose.measuredAt).toLocaleDateString("fr-BJ") : "Récemment"}</span>
            </p>
          </div>

          {/* Fréquence Cardiaque */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                <Heart className="w-5 h-5" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Régulier
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Pouls au repos</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {latestVitals.heart_rate?.value || "72"}
                </span>
                <span className="text-xs font-bold text-slate-400">bpm</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{latestVitals.heart_rate ? new Date(latestVitals.heart_rate.measuredAt).toLocaleDateString("fr-BJ") : "Récemment"}</span>
            </p>
          </div>

          {/* Poids Corporel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Scale className="w-5 h-5" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                IMC 22.8
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500">Poids Corporel</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {latestVitals.weight?.value || "71.4"}
                </span>
                <span className="text-xs font-bold text-slate-400">kg</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{latestVitals.weight ? new Date(latestVitals.weight.measuredAt).toLocaleDateString("fr-BJ") : "Récemment"}</span>
            </p>
          </div>

        </div>
      </div>

      {/* 3. Section Deux Colonnes : Ordonnances Électroniques & Rendez-vous */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Colonne Gauche : Ordonnances Électroniques Actives */}
        <div id="prescriptions" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between scroll-mt-24">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Ordonnances Électroniques Actives
                  </h3>
                  <p className="text-xs text-slate-500">Registre National e-Prescription</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {prescriptions.filter((p) => p.status === "active").length} active(s)
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {prescriptions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Aucune ordonnance active actuellement.
                </div>
              ) : (
                prescriptions.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-teal-600 dark:text-teal-400">
                            {p.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}>
                            {p.status === "active" ? "Active • À délivrer" : "Délivrée en officine"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Prescrit par : <strong>Dr. {p.doctor?.firstName} {p.doctor?.lastName}</strong> ({p.doctor?.professionalId || "CNHU-HKM"})
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Délivré le {new Date(p.issuedAt).toLocaleDateString("fr-BJ")}
                        </p>
                      </div>

                      <button
                        onClick={() => handleShowPrescriptionQr(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Présenter QR</span>
                      </button>
                    </div>

                    {/* Liste des médicaments prescrits */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                      {p.medications.map((m, idx) => (
                        <div key={idx} className="text-xs flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{m.name}</p>
                            <p className="text-[11px] text-slate-500">{m.dosage} • {m.duration}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{m.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Sécurisé par signature cryptographique ANIP</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">Valable dans toutes les pharmacies agréées</span>
          </div>
        </div>

        {/* Colonne Droite : Rendez-vous & Téléconsultations */}
        <div id="appointments" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between scroll-mt-24">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
                  <Calendar className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Prochains Rendez-vous & Téléconsultations
                  </h3>
                  <p className="text-xs text-slate-500">Hôpitaux & Téléconsultation Care.bj</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={openBookModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Prendre RDV</span>
                </button>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {appointments.length} prévu(s)
                </span>
              </div>
            </div>

            {/* Notification de Confirmation SMS */}
            {bookingAlert && (
              <div className="mt-3 p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-950 dark:text-teal-200 text-xs flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Rendez-vous confirmé ! Alerte SMS transmise au <strong>{bookingAlert.smsAlert.sentTo}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setBookingAlert(null)}
                  className="text-teal-600 hover:text-teal-800 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {appointments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Aucun rendez-vous planifié.
                </div>
              ) : (
                appointments.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.type === "teleconsultation"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}>
                            {a.type === "teleconsultation" ? "Téléconsultation Vidéo" : "Présentiel"}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {new Date(a.dateTime).toLocaleDateString("fr-BJ", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            a.status === "confirmed" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" :
                            a.status === "completed" ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" :
                            a.status === "cancelled" ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" :
                            "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}>
                            {a.status === "confirmed" ? "Confirmé" : a.status === "completed" ? "Terminé" : a.status === "cancelled" ? "Annulé" : "En attente"}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          Dr. {a.doctor?.firstName} {a.doctor?.lastName} ({a.doctor?.professionalId || "CNHU-HKM"})
                        </p>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{a.facility}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {a.type === "teleconsultation" && a.status !== "cancelled" ? (
                          <button
                            onClick={() => setActiveTeleconsultation(a)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Rejoindre</span>
                          </button>
                        ) : null}

                        {a.status !== "cancelled" && a.status !== "completed" && (
                          <button
                            onClick={async () => {
                              if (confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
                                try {
                                  await fetch(`/api/appointments/${a.id}`, { method: "DELETE" });
                                  onRefresh();
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>

                    {a.notes && (
                      <p className="text-[11px] text-slate-500 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        💬 Note : {a.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Rappels SMS automatiques envoyés 24h avant</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Téléconsultation sans frais ARCH</span>
          </div>
        </div>

      </div>

      {/* 4. Carnet Vaccinal Électronique (Programme Élargi de Vaccination - PEV Bénin) */}
      <div id="vaccines" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
              <Syringe className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Carnet Vaccinal Électronique (PEV Bénin)
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  Homologué Ministère de la Santé
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Suivi national des vaccinations obligatoires et rappels décennaux
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddVaccineOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Enregistrer un vaccin</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaccinations.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-400 text-xs">
              Aucun vaccin enregistré dans votre dossier.
            </div>
          ) : (
            vaccinations.map((vac) => (
              <div
                key={vac.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {vac.vaccineName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        vac.status === "administered"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : vac.status === "scheduled"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {vac.status === "administered"
                        ? "Administré"
                        : vac.status === "scheduled"
                        ? "Rappel prévu"
                        : "En retard"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    Cible : {vac.diseaseTarget}
                  </p>

                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-2">
                    {vac.dose}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 space-y-1">
                  {vac.administeredAt && (
                    <p className="flex items-center justify-between">
                      <span>Date injection :</span>
                      <strong className="text-slate-700 dark:text-slate-300">
                        {new Date(vac.administeredAt).toLocaleDateString("fr-BJ")}
                      </strong>
                    </p>
                  )}
                  {vac.nextDueDate && (
                    <p className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-semibold">
                      <span>Échéance rappel :</span>
                      <span>{new Date(vac.nextDueDate).toLocaleDateString("fr-BJ")}</span>
                    </p>
                  )}
                  {vac.batchNumber && (
                    <p className="flex items-center justify-between font-mono text-[10px]">
                      <span>Lot :</span>
                      <span className="text-slate-600 dark:text-slate-400">{vac.batchNumber}</span>
                    </p>
                  )}
                  {vac.facility && (
                    <p className="text-[10px] text-slate-400 truncate" title={vac.facility}>
                      📍 {vac.facility}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. Section Contacts d'Urgence et Données Médicales de Secours */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl shrink-0">
            🚑
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Données vitales en cas d&apos;urgence</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Groupe sanguin : <strong className="text-rose-400">{user.bloodGroup || "O+"}</strong> • Allergies : <strong className="text-amber-300">{user.allergies?.join(", ") || "Aucune"}</strong> • Contact proche : <strong className="text-white">{user.emergencyContact || "Mme Chantal BIO (+229 97 00 11 22)"}</strong>
            </p>
          </div>
        </div>

        <a
          href="tel:112"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Appeler le SAMU 112</span>
        </a>
      </div>

      {/* Modale Carte Numérique */}
      <DigitalHealthCardModal
        user={user}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />

      {/* Modale Enregistrement Constante */}
      <AddVitalSignModal
        isOpen={isAddVitalOpen}
        onClose={() => setIsAddVitalOpen(false)}
        onSuccess={onRefresh}
      />

      {/* Modale Enregistrement Vaccin */}
      <AddVaccineModal
        isOpen={isAddVaccineOpen}
        onClose={() => setIsAddVaccineOpen(false)}
        onSuccess={onRefresh}
      />

      {/* Modale QR Ordonnance */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="font-mono text-sm font-bold text-teal-600">
              {selectedPrescription.code}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              QR Code E-Prescription Sécurisée
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Présentez ce code au pharmacien pour délivrance
            </p>

            <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block mb-4">
              {prescriptionQrUrl && (
                <img
                  src={prescriptionQrUrl}
                  alt="QR Prescription"
                  className="w-48 h-48 object-contain"
                />
              )}
            </div>

            <p className="text-[10px] font-mono text-slate-400 break-all mb-4 px-2">
              {selectedPrescription.qrHash}
            </p>

            <button
              onClick={() => setSelectedPrescription(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modale de Réservation de Rendez-vous */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={closeBookModal}
        userPhone={user.phone}
        onSuccess={(appointment, smsAlert) => {
          setBookingAlert({ appointment, smsAlert });
          onRefresh();
        }}
      />

      {/* Salle de Téléconsultation Frugale */}
      {activeTeleconsultation && (
        <TeleconsultationModal
          isOpen={!!activeTeleconsultation}
          onClose={() => setActiveTeleconsultation(null)}
          appointment={activeTeleconsultation}
          currentUser={user}
          patientVitals={vitals}
        />
      )}

    </div>
  );
}
