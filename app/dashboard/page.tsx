import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { 
  vitalSignRepository, 
  appointmentRepository, 
  prescriptionRepository,
  VitalSignRecord,
  AppointmentRecord,
  PrescriptionRecord
} from "@/lib/db";
import DashboardClientShell from "@/components/dashboard/DashboardClientShell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  let initialVitals: VitalSignRecord[] = [];
  let initialAppointments: AppointmentRecord[] = [];
  let initialPrescriptions: PrescriptionRecord[] = [];

  try {
    if (user.role === "patient") {
      [initialVitals, initialAppointments, initialPrescriptions] = await Promise.all([
        vitalSignRepository.getByUserId(user.id),
        appointmentRepository.getByPatientId(user.id),
        prescriptionRepository.getByPatientId(user.id),
      ]);
    } else if (user.role === "doctor") {
      [initialAppointments, initialPrescriptions] = await Promise.all([
        appointmentRepository.getByDoctorId(user.id),
        prescriptionRepository.getByDoctorId(user.id),
      ]);
    } else if (user.role === "pharmacy") {
      initialPrescriptions = await prescriptionRepository.getByPharmacyId(user.id);
    }
  } catch (err) {
    console.error("Erreur chargement données dashboard PostgreSQL :", err);
  }

  return (
    <DashboardClientShell
      user={user}
      initialVitals={initialVitals}
      initialAppointments={initialAppointments}
      initialPrescriptions={initialPrescriptions}
    />
  );
}
