"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Phone
} from "lucide-react";
import { AppointmentRecord } from "@/lib/db";

interface DoctorOption {
  id: string;
  firstName: string;
  lastName: string;
  professionalId?: string | null;
  specialty: string;
  facility: string;
  phone: string;
}

interface SmsAlert {
  sentTo: string;
  message: string;
}

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: AppointmentRecord, smsAlert: SmsAlert) => void;
  userPhone?: string;
}

const BENIN_TIME_SLOTS = [
  "08:30", "09:15", "10:00", "10:45", "11:30",
  "14:00", "14:45", "15:30", "16:15", "17:00"
];

const PREDEFINED_REASONS = [
  "Consultation générale",
  "Suivi tension artérielle",
  "Lecture d'analyses de laboratoire",
  "Renouvellement d'ordonnance",
  "Avis pédiatrique",
  "Bilan cardiologique préventif"
];

export default function BookAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  userPhone,
}: BookAppointmentModalProps) {
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Form State
  const [type, setType] = useState<"in_person" | "teleconsultation">("teleconsultation");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Demain par défaut
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>("09:15");
  const [facility, setFacility] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    appointment: AppointmentRecord;
    smsAlert: SmsAlert;
  } | null>(null);

  // Charger les médecins enregistrés
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadDoctors() {
      setLoadingDoctors(true);
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (mounted && data.success && data.doctors) {
          setDoctors(data.doctors);
          if (data.doctors.length > 0) {
            setSelectedDoctorId(data.doctors[0].id);
            setFacility(
              type === "teleconsultation"
                ? "Téléconsultation sécurisée Care.bj"
                : data.doctors[0].facility
            );
          }
        }
      } catch (err) {
        console.error("Erreur chargement médecins:", err);
      } finally {
        if (mounted) setLoadingDoctors(false);
      }
    }

    loadDoctors();
    return () => {
      mounted = false;
    };
  }, [isOpen, type]);

  // Synchroniser l'établissement selon le médecin et le type
  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    const doc = doctors.find((d) => d.id === doctorId);
    if (doc) {
      if (type === "teleconsultation") {
        setFacility("Téléconsultation sécurisée Care.bj");
      } else {
        setFacility(doc.facility);
      }
    }
  };

  const handleTypeChange = (newType: "in_person" | "teleconsultation") => {
    setType(newType);
    const doc = doctors.find((d) => d.id === selectedDoctorId);
    if (newType === "teleconsultation") {
      setFacility("Téléconsultation sécurisée Care.bj");
    } else if (doc) {
      setFacility(doc.facility);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError("Veuillez sélectionner un médecin.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError("Veuillez choisir une date et un créneau horaire.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const combinedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          dateTime: combinedDateTime.toISOString(),
          type,
          facility: facility || (type === "teleconsultation" ? "Téléconsultation sécurisée Care.bj" : "Centre Hospitalier CNHU-HKM"),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Erreur lors de la réservation du rendez-vous.");
        setSubmitting(false);
        return;
      }

      setSuccessInfo({
        appointment: data.appointment,
        smsAlert: data.smsAlert,
      });

      setTimeout(() => {
        onSuccess(data.appointment, data.smsAlert);
        onClose();
        setSuccessInfo(null);
      }, 2000);
    } catch (err) {
      console.error("Erreur création rendez-vous:", err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        
        {/* Header Modale */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Prendre un Rendez-vous Médical
              </h3>
              <p className="text-xs text-slate-500">
                Portail National e-Santé Bénin • Confirmation instantanée par SMS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message de Succès */}
        {successInfo ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Rendez-vous Confirmé avec Succès !
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Votre consultation avec le <strong>Dr. {selectedDoctor?.lastName}</strong> est enregistrée pour le{" "}
              <strong>{new Date(successInfo.appointment.dateTime).toLocaleDateString("fr-BJ", { weekday: "long", day: "numeric", month: "long" })} à {selectedTime}</strong>.
            </p>
            {successInfo.smsAlert && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="text-left font-mono">
                  SMS transmis au {successInfo.smsAlert.sentTo}
                </span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Choix du Type de Rendez-vous */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                1. Mode de Consultation :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("teleconsultation")}
                  className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                    type === "teleconsultation"
                      ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    type === "teleconsultation" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black">Téléconsultation Frugale (Vidéo / Audio)</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Sans déplacement • Adaptation automatique bas-débit 3G/2G • Chiffré
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("in_person")}
                  className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                    type === "in_person"
                      ? "border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    type === "in_person" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black">Consultation en Présentiel</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Sur place au centre hospitalier ou dispensaire conventionné
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Sélection du Praticien & Spécialité */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                2. Médecin Praticien & Spécialité :
              </label>
              {loadingDoctors ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500">
                  Chargement des praticiens de l&apos;Ordre National...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleDoctorChange(doc.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/50 ring-2 ring-teal-500/20"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                          }`}>
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              Dr. {doc.firstName} {doc.lastName}
                            </p>
                            <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400">
                              {doc.professionalId || "ONMB"}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 font-medium">
                          {doc.specialty}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Établissement si présentiel */}
            {type === "in_person" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Établissement de Santé :
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    required
                    placeholder="Ex: CNHU-HKM Cotonou - Clinique Universitaire"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* 3. Date et Créneaux Horaires */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  3. Date du Rendez-vous :
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Créneau Horaire :
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {BENIN_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        selectedTime === slot
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Motif & Notes Cliniques */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                4. Motif de consultation :
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PREDEFINED_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNotes(r)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Précisez vos symptômes, antécédents ou questions pour le praticien..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Note Souveraine & Rappel SMS */}
            <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/50 flex items-center justify-between text-xs text-teal-800 dark:text-teal-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Rappels SMS automatiques 24h et 2h avant la consultation</span>
              </span>
              <span className="font-mono text-[11px] font-bold">
                {userPhone ? `Destinataire : ${userPhone}` : "SMS local Bénin (+229)"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 active:scale-95 transition-all"
              >
                {submitting ? (
                  <span>Confirmation en cours...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirmer la Réservation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
