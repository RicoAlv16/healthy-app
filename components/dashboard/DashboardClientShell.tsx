"use client";

import React, { useState } from "react";
import { SafeUser, VitalSignRecord, AppointmentRecord, PrescriptionRecord, VaccinationRecord } from "@/lib/db";
import DashboardSidebar from "./DashboardSidebar";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import DigitalHealthCardModal from "./DigitalHealthCardModal";

interface DashboardClientShellProps {
  user: SafeUser;
  initialVitals: VitalSignRecord[];
  initialAppointments: AppointmentRecord[];
  initialPrescriptions: PrescriptionRecord[];
  initialVaccinations?: VaccinationRecord[];
}

export default function DashboardClientShell({
  user,
  initialVitals,
  initialAppointments,
  initialPrescriptions,
  initialVaccinations = [],
}: DashboardClientShellProps) {
  const [vitals, setVitals] = useState<VitalSignRecord[]>(initialVitals);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(initialAppointments);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(initialPrescriptions);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(initialVaccinations);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const handleRefresh = async () => {
    try {
      if (user.role === "patient") {
        const [vRes, aRes, pRes, vacRes] = await Promise.all([
          fetch("/api/vitals"),
          fetch("/api/appointments"),
          fetch("/api/prescriptions"),
          fetch("/api/vaccinations"),
        ]);
        if (vRes.ok) {
          const vData = await vRes.json();
          if (vData.vitals) setVitals(vData.vitals);
        }
        if (aRes.ok) {
          const aData = await aRes.json();
          if (aData.appointments) setAppointments(aData.appointments);
        }
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.prescriptions) setPrescriptions(pData.prescriptions);
        }
        if (vacRes.ok) {
          const vacData = await vacRes.json();
          if (vacData.vaccinations) setVaccinations(vacData.vaccinations);
        }
      } else if (user.role === "doctor") {
        const [aRes, pRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/prescriptions"),
        ]);
        if (aRes.ok) {
          const aData = await aRes.json();
          if (aData.appointments) setAppointments(aData.appointments);
        }
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.prescriptions) setPrescriptions(pData.prescriptions);
        }
      } else if (user.role === "pharmacy") {
        const pRes = await fetch("/api/prescriptions");
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.prescriptions) setPrescriptions(pData.prescriptions);
        }
      }
    } catch (err) {
      console.error("Erreur actualisation dashboard:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        user={user}
        onOpenCard={() => setIsCardModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {user.role === "doctor" ? (
          <DoctorDashboard
            user={user}
            appointments={appointments}
            prescriptions={prescriptions}
            onRefresh={handleRefresh}
          />
        ) : user.role === "pharmacy" ? (
          <PharmacyDashboard
            user={user}
            prescriptions={prescriptions}
            onRefresh={handleRefresh}
          />
        ) : (
          <PatientDashboard
            user={user}
            vitals={vitals}
            appointments={appointments}
            prescriptions={prescriptions}
            vaccinations={vaccinations}
            onRefresh={handleRefresh}
          />
        )}
      </main>

      {/* Modal Carte de Santé Souveraine ANIP */}
      {user.role === "patient" && (
        <DigitalHealthCardModal
          user={user}
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
        />
      )}
    </div>
  );
}
