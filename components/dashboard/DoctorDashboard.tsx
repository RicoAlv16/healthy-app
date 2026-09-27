"use client";

import React, { useState, useEffect } from "react";
import { SafeUser, AppointmentRecord, PrescriptionRecord, VitalSignRecord, VaccinationRecord, EmergencyAccessLogRecord } from "@/lib/db";
import { 
  Stethoscope, 
  Search, 
  FilePlus, 
  Calendar, 
  Plus, 
  Trash2,
  ShieldAlert,
  Syringe,
  Phone,
  Video,
  WifiOff,
  RefreshCw,
  Zap,
  CheckCircle2
} from "lucide-react";
import BreakGlassModal, { SmsAlertInfo } from "./BreakGlassModal";
import TeleconsultationModal from "./TeleconsultationModal";
import { 
  saveOfflinePrescription, 
  getOfflinePrescriptions, 
  syncOfflinePrescriptions, 
  OfflinePrescription 
} from "@/lib/offlineQueue";

interface DoctorDashboardProps {
  user: SafeUser;
  appointments: AppointmentRecord[];
  prescriptions: PrescriptionRecord[];
  onRefresh: () => void;
}

interface PatientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  npi?: string | null;
  phone: string;
  email: string;
  bloodGroup?: string | null;
  archNumber?: string | null;
  emergencyContact?: string | null;
  allergies: string[];
}

export default function DoctorDashboard({
  user,
  appointments,
  prescriptions,
  onRefresh,
}: DoctorDashboardProps) {
  // Recherche dossier patient
  const [searchQuery, setSearchQuery] = useState("1092-8472-9104");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    patient: PatientSearchResult;
    vitals: VitalSignRecord[];
    prescriptions: PrescriptionRecord[];
    appointments: AppointmentRecord[];
    vaccinations?: VaccinationRecord[];
    emergencyAccessLogs?: EmergencyAccessLogRecord[];
  } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Bris de glace (Urgence)
  const [isBreakGlassOpen, setIsBreakGlassOpen] = useState(false);
  const [breakGlassAlert, setBreakGlassAlert] = useState<{
    log: EmergencyAccessLogRecord;
    smsAlert: SmsAlertInfo;
  } | null>(null);

  // Téléconsultation active
  const [activeTeleconsultation, setActiveTeleconsultation] = useState<AppointmentRecord | null>(null);

  // Formulaire nouvelle e-prescription
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescripPatientId, setPrescripPatientId] = useState("");
  const [medications, setMedications] = useState([
    { name: "Artemether + Luméfantrine (Coartem 80/480mg)", dosage: "1 comprimé matin et soir avec un repas gras", duration: "3 jours", quantity: "1 boîte", instructions: "Traitement antipaludique complet" },
    { name: "Vitamine C 500mg à croquer", dosage: "1 comprimé le matin", duration: "10 jours", quantity: "1 tube", instructions: "Ne pas prendre après 16h" },
  ]);
  const [creatingPrescription, setCreatingPrescription] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState<string | null>(null);

  // File d'attente Offline / Mode 2G Frugal (Tournée Rurale)
  const [offlinePrescriptions, setOfflinePrescriptions] = useState<OfflinePrescription[]>([]);
  const [syncingOffline, setSyncingOffline] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    setIsOfflineMode(typeof window !== "undefined" && !navigator.onLine);
    setOfflinePrescriptions(getOfflinePrescriptions());

    const handleOnline = async () => {
      setIsOfflineMode(false);
      const queue = getOfflinePrescriptions();
      if (queue.length > 0) {
        setSyncingOffline(true);
        const { successCount } = await syncOfflinePrescriptions();
        setSyncingOffline(false);
        if (successCount > 0) {
          setSyncNotice(`⚡ Réseau rétabli : ${successCount} ordonnance(s) synchronisée(s) avec succès avec le serveur central !`);
          onRefresh();
          setTimeout(() => setSyncNotice(null), 5000);
        }
      }
      setOfflinePrescriptions(getOfflinePrescriptions());
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
      setOfflinePrescriptions(getOfflinePrescriptions());
    };

    const handleQueueChanged = () => {
      setOfflinePrescriptions(getOfflinePrescriptions());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("care-offline-queue-changed", handleQueueChanged);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("care-offline-queue-changed", handleQueueChanged);
    };
  }, [onRefresh]);

  const handleManualSync = async () => {
    setSyncingOffline(true);
    const { successCount, failedCount } = await syncOfflinePrescriptions();
    setSyncingOffline(false);
    if (successCount > 0) {
      setSyncNotice(`✅ ${successCount} ordonnance(s) synchronisée(s) avec succès avec le serveur central !`);
      onRefresh();
      setTimeout(() => setSyncNotice(null), 5000);
    } else if (failedCount > 0) {
      alert("La synchronisation a échoué. Vérifiez votre connexion Internet.");
    }
    setOfflinePrescriptions(getOfflinePrescriptions());
  };

  const handleSearchPatient = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/doctor/search-patient?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSearchError(data.message || "Dossier introuvable dans le registre ANIP.");
        setSearchResult(null);
        return;
      }

      setSearchResult(data);
      setPrescripPatientId(data.patient.id);
    } catch (err) {
      console.error("Erreur recherche patient:", err);
      setSearchError("Erreur réseau lors de la recherche du dossier.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", duration: "", quantity: "1 boîte", instructions: "" },
    ]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedChange = (index: number, field: "name" | "dosage" | "duration" | "quantity" | "instructions", val: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: val };
    setMedications(updated);
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescripPatientId) {
      alert("Veuillez sélectionner un patient.");
      return;
    }

    setCreatingPrescription(true);
    setPrescriptionSuccess(null);

    // Détection immédiate du mode hors-ligne / 2G Frugal
    if (typeof window !== "undefined" && !navigator.onLine) {
      const saved = saveOfflinePrescription({
        patientId: prescripPatientId,
        medications,
      });
      setPrescriptionSuccess(
        `⚡ Mode Frugal 2G / Hors-Ligne : Ordonnance ${saved.tempCode} signée et sécurisée localement. Elle sera transmise automatiquement dès reconnexion au réseau.`
      );
      setOfflinePrescriptions(getOfflinePrescriptions());
      setCreatingPrescription(false);
      setTimeout(() => {
        setIsPrescriptionModalOpen(false);
        setPrescriptionSuccess(null);
      }, 2500);
      return;
    }

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: prescripPatientId,
          medications,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Erreur lors de l'émission");
        setCreatingPrescription(false);
        return;
      }

      setPrescriptionSuccess(`Ordonnance ${data.prescription.code} émise et signée numériquement avec succès.`);
      onRefresh();
      setTimeout(() => {
        setIsPrescriptionModalOpen(false);
        setPrescriptionSuccess(null);
      }, 1500);
    } catch (err) {
      console.warn("Échec réseau lors de l'émission, bascule automatique en mode Frugal 2G / Local:", err);
      // Fallback automatique si la connexion lâche pendant l'envoi (2G instable)
      const saved = saveOfflinePrescription({
        patientId: prescripPatientId,
        medications,
      });
      setPrescriptionSuccess(
        `⚡ Connexion instable (2G Frugal) : Ordonnance ${saved.tempCode} sécurisée localement sur l'appareil. Synchronisation différée programmée.`
      );
      setOfflinePrescriptions(getOfflinePrescriptions());
      setTimeout(() => {
        setIsPrescriptionModalOpen(false);
        setPrescriptionSuccess(null);
      }, 2500);
    } finally {
      setCreatingPrescription(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Praticien CNHU */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Ordre National des Médecins : {user.professionalId || "ONMB-4812"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                CNHU-HKM Cotonou
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-teal-400" />
              <span>Dr. {user.firstName} {user.lastName}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Portail Hospitalier Souverain d&apos;e-Santé. Consultation des dossiers patients nationaux ANIP, suivi des constantes et télé-prescription.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => document.getElementById("appointments")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-800/80 hover:bg-teal-700 text-white font-bold text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap border border-teal-500/30"
            >
              <Calendar className="w-4 h-4 text-teal-300" />
              <span>Consultations & Visios ({appointments.length})</span>
            </button>

            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              <FilePlus className="w-4 h-4" />
              <span>Émettre une E-Ordonnance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Recherche Rapide Dossier Patient par NPI */}
      <div id="search" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs scroll-mt-24">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-600" />
              <span>Recherche Dossier Médical Patient (Registre ANIP)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Saisissez le NPI (Numéro Personnel d&apos;Identification), l&apos;email ou le téléphone du patient
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchPatient} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: 1092-8472-9104 ou bio.kora@citoyen.bj"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-500 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            {searching ? "Recherche en cours..." : "Consulter le dossier"}
          </button>
        </form>

        {searchError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs border border-red-200 dark:border-red-900">
            {searchError}
          </div>
        )}

        {/* Résultat de la recherche Dossier Patient */}
        {searchResult && (
          <div className="mt-6 p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 animate-fade-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-teal-200/60 dark:border-teal-800/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center">
                  {searchResult.patient.firstName[0]}{searchResult.patient.lastName[0]}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">
                    {searchResult.patient.lastName} {searchResult.patient.firstName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-mono font-bold text-teal-800 dark:text-teal-300">NPI: {searchResult.patient.npi}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-800 dark:text-emerald-400">ARCH: {searchResult.patient.archNumber}</span>
                    <span>•</span>
                    <span>Tél: {searchResult.patient.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Groupe : {searchResult.patient.bloodGroup || "O+"}
                </span>
                <button
                  onClick={() => setIsBreakGlassOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  title="Accès d'urgence dérogatoire conforme APDP"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>🚨 Bris de Glace</span>
                </button>
                <button
                  onClick={() => {
                    setPrescripPatientId(searchResult.patient.id);
                    setIsPrescriptionModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  + Rédiger ordonnance
                </button>
              </div>
            </div>

            {/* Bannière d'accès d'urgence APDP si bris de glace actif */}
            {(breakGlassAlert || (searchResult.emergencyAccessLogs && searchResult.emergencyAccessLogs.length > 0)) && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-950 dark:text-rose-200 space-y-2 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-black text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Accès d&apos;Urgence « Bris de Glace » Actif & Notifié APDP
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold">
                    Conforme Loi n° 2017-20 (Code du Numérique Bénin)
                  </span>
                </div>
                {breakGlassAlert ? (
                  <div className="text-xs space-y-1.5">
                    <p><strong>Motif clinique déclaré :</strong> {breakGlassAlert.log.reason}</p>
                    <p className="flex items-center gap-1.5 text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                      <Phone className="w-3.5 h-3.5 text-rose-600" />
                      <span>Alerte SMS transmise au patient ({breakGlassAlert.smsAlert?.to}) : <em>« {breakGlassAlert.smsAlert?.message} »</em></span>
                    </p>
                  </div>
                ) : searchResult.emergencyAccessLogs && searchResult.emergencyAccessLogs[0] ? (
                  <div className="text-xs space-y-1">
                    <p><strong>Dernier accès d&apos;urgence consigné :</strong> {new Date(searchResult.emergencyAccessLogs[0].accessedAt).toLocaleDateString("fr-BJ")} par {searchResult.emergencyAccessLogs[0].doctor?.firstName ? `Dr. ${searchResult.emergencyAccessLogs[0].doctor.firstName} ${searchResult.emergencyAccessLogs[0].doctor.lastName}` : "Praticien urgentiste"} ({searchResult.emergencyAccessLogs[0].facility})</p>
                    <p><strong>Motif clinique :</strong> {searchResult.emergencyAccessLogs[0].reason}</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Constantes vitales du patient */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                Constantes vitales enregistrées :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {searchResult.vitals.slice(0, 4).map((v) => (
                  <div key={v.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">{v.type.replace("_", " ")}</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5">
                      {v.value} {v.unit}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1">
                      {new Date(v.measuredAt).toLocaleDateString("fr-BJ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Carnet Vaccinal Électronique (PEV Bénin) */}
            <div className="pt-2 border-t border-teal-200/50 dark:border-teal-800/40">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                  <Syringe className="w-3.5 h-3.5 text-teal-600" />
                  <span>Carnet Vaccinal Électronique (PEV Bénin)</span>
                </p>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-bold">
                  {searchResult.vaccinations?.length || 0} vaccin(s) enregistré(s)
                </span>
              </div>
              {searchResult.vaccinations && searchResult.vaccinations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {searchResult.vaccinations.map((vac) => (
                    <div key={vac.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white truncate">{vac.vaccineName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          vac.status === "administered" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                          vac.status === "scheduled" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" :
                          "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}>
                          {vac.status === "administered" ? "Administré" : vac.status === "scheduled" ? "Prévu" : "En retard"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">Dose: {vac.dose} • Lot: {vac.batchNumber || "Non spécifié"}</p>
                      <p className="text-[10px] text-slate-400">
                        {vac.administeredAt ? `Fait le ${new Date(vac.administeredAt).toLocaleDateString("fr-BJ")}` : vac.nextDueDate ? `Prévu le ${new Date(vac.nextDueDate).toLocaleDateString("fr-BJ")}` : "Date indéterminée"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Aucun vaccin PEV consigné à ce jour.</p>
              )}
            </div>

            {/* Allergies et contact d'urgence */}
            <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-wrap gap-4 pt-1">
              <p><strong>Allergies signalées :</strong> {searchResult.patient.allergies.length > 0 ? searchResult.patient.allergies.join(", ") : "Aucune"}</p>
              <p><strong>Contact d&apos;urgence :</strong> {searchResult.patient.emergencyContact || "Non renseigné"}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. File des Consultations et Rendez-vous Praticien */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rendez-vous Praticien */}
        <div id="appointments" className="scroll-mt-24 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Consultations & Rendez-vous Programmés</span>
            </h3>
            <span className="text-xs font-bold text-teal-600">
              {appointments.length} patient(s)
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {appointments.length === 0 ? (
              <p className="py-6 text-center text-slate-400 text-xs">Aucun rendez-vous planifié.</p>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.type === "teleconsultation"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}>
                          {a.type === "teleconsultation" ? "Téléconsultation Vidéo" : "Présentiel"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          a.status === "completed" ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" :
                          a.status === "cancelled" ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" :
                          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        }`}>
                          {a.status === "completed" ? "Terminé" : a.status === "cancelled" ? "Annulé" : "Confirmé"}
                        </span>
                      </div>

                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {a.patient?.firstName} {a.patient?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        NPI: {a.patient?.npi} • ARCH: {a.patient?.archNumber}
                      </p>
                      <p className="text-xs text-teal-700 dark:text-teal-400">
                        {new Date(a.dateTime).toLocaleDateString("fr-BJ", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {a.type === "teleconsultation" && a.status !== "cancelled" && (
                        <button
                          onClick={() => setActiveTeleconsultation(a)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
                          title="Lancer la téléconsultation en direct"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Lancer Visio</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSearchQuery(a.patient?.npi || a.patient?.phone || "");
                          handleSearchPatient();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors"
                      >
                        Dossier
                      </button>

                      {a.status !== "completed" && a.status !== "cancelled" && (
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`/api/appointments/${a.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: "completed" }),
                              });
                              onRefresh();
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 dark:bg-slate-700 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-xs font-bold transition-colors"
                          title="Marquer la consultation comme achevée"
                        >
                          Clôturer
                        </button>
                      )}
                    </div>
                  </div>
                  {a.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      Motif : {a.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ordonnances délivrées par le médecin */}
        <div id="prescriptions" className="scroll-mt-24 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          
          {syncNotice && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}

          {offlinePrescriptions.length > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                <span>
                  <strong>Mode Frugal / Tournée Rurale :</strong> {offlinePrescriptions.length} ordonnance(s) sécurisée(s) en local.
                </span>
              </div>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={syncingOffline}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingOffline ? "animate-spin" : ""}`} />
                <span>{syncingOffline ? "Synchronisation..." : "Synchroniser"}</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-teal-600" />
              <span>Dernières Ordonnances Émises</span>
            </h3>
            <span className="text-xs font-bold text-teal-600">
              {prescriptions.length + offlinePrescriptions.length} émise(s)
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {/* Ordonnances en attente de synchronisation (Saisies en mode Frugal 2G) */}
            {offlinePrescriptions.map((op) => (
              <div key={op.id} className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-700/60 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400">{op.tempCode}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        Local (2G Frugal)
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      Patient ID : {op.patientId}
                    </p>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                      Enregistrée hors-ligne le {new Date(op.createdAt).toLocaleTimeString("fr-BJ", { hour: "2-digit", minute: "2-digit" })} • En attente de réseau
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={syncingOffline}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-800/60 text-amber-800 dark:text-amber-200 text-[10px] font-bold border border-amber-300 dark:border-amber-700 transition-colors"
                  >
                    Synchro différée
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-xs text-slate-600 dark:text-slate-300">
                  {op.medications.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span>• {m.name} ({m.dosage})</span>
                      <span className="text-slate-400">{m.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {prescriptions.length === 0 && offlinePrescriptions.length === 0 ? (
              <p className="py-6 text-center text-slate-400 text-xs">Aucune ordonnance émise récemment.</p>
            ) : (
              prescriptions.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400">{p.code}</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Patient : {p.patient?.firstName} {p.patient?.lastName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Émise le {new Date(p.issuedAt).toLocaleDateString("fr-BJ")}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}>
                      {p.status === "active" ? "Active" : "Délivrée"}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    {p.medications.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span>• {m.name}</span>
                        <span className="text-slate-400">{m.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modale d'émission d'ordonnance */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Émission d&apos;une Ordonnance Électronique Souveraine
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                isOfflineMode 
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 animate-pulse" 
                  : "bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
              }`} title="Fonctionne 100% hors-ligne avec synchronisation automatique">
                {isOfflineMode ? <WifiOff className="w-3 h-3 text-amber-600" /> : <Zap className="w-3 h-3 text-teal-600" />}
                <span>{isOfflineMode ? "Mode 2G Frugal Actif" : "Résilience 2G / Frugal"}</span>
              </span>
            </div>

            {prescriptionSuccess && (
              <div className="my-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                {prescriptionSuccess}
              </div>
            )}

            <form onSubmit={handleCreatePrescription} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  ID du Patient (NPI ou interne) :
                </label>
                <input
                  type="text"
                  value={prescripPatientId}
                  onChange={(e) => setPrescripPatientId(e.target.value)}
                  placeholder="ID du patient (ex: usr_patient_001)"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Médicaments prescrits :
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un médicament</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {medications.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-teal-600">Médicament #{idx + 1}</span>
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleMedChange(idx, "name", e.target.value)}
                          placeholder="Nom de la molécule / spécialité"
                          required
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                        <input
                          type="text"
                          value={m.dosage}
                          onChange={(e) => handleMedChange(idx, "dosage", e.target.value)}
                          placeholder="Posologie (ex: 1 gélule 3 fois/jour)"
                          required
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                        <input
                          type="text"
                          value={m.duration}
                          onChange={(e) => handleMedChange(idx, "duration", e.target.value)}
                          placeholder="Durée (ex: 7 jours)"
                          required
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                        <input
                          type="text"
                          value={m.instructions}
                          onChange={(e) => handleMedChange(idx, "instructions", e.target.value)}
                          placeholder="Instructions particulières"
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPrescriptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingPrescription}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  {creatingPrescription ? "Signature & Envoi..." : "Signer & Émettre l'ordonnance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale d'accès d'urgence - Bris de Glace */}
      {searchResult && (
        <BreakGlassModal
          isOpen={isBreakGlassOpen}
          onClose={() => setIsBreakGlassOpen(false)}
          patientId={searchResult.patient.id}
          patientName={`${searchResult.patient.firstName} ${searchResult.patient.lastName}`}
          patientPhone={searchResult.patient.phone}
          onSuccess={(log, smsAlert) => {
            setBreakGlassAlert({ log, smsAlert });
            setIsBreakGlassOpen(false);
            handleSearchPatient();
          }}
        />
      )}

      {/* Salle de Téléconsultation Praticien */}
      {activeTeleconsultation && (
        <TeleconsultationModal
          isOpen={!!activeTeleconsultation}
          onClose={() => setActiveTeleconsultation(null)}
          appointment={activeTeleconsultation}
          currentUser={user}
          patientVitals={searchResult?.vitals || []}
          onOpenPrescriptionModal={(patientId) => {
            setPrescripPatientId(patientId);
            setIsPrescriptionModalOpen(true);
          }}
        />
      )}

    </div>
  );
}
