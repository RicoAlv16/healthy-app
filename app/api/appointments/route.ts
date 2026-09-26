import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { appointmentRepository, userRepository } from "@/lib/db";
import { z } from "zod";

const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Médecin requis"),
  dateTime: z.string().min(1, "Date et heure requises"),
  type: z.enum(["in_person", "teleconsultation"]).default("in_person"),
  facility: z.string().min(1, "Établissement de santé requis"),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    if (session.user.role === "doctor") {
      const appointments = await appointmentRepository.getByDoctorId(session.user.id);
      return NextResponse.json({ success: true, appointments });
    }

    const appointments = await appointmentRepository.getByPatientId(session.user.id);
    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error("Erreur GET appointments:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    // Vérifier l'existence du médecin
    const doctor = await userRepository.findById(parsed.data.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json({ success: false, message: "Médecin introuvable" }, { status: 404 });
    }

    const appt = await appointmentRepository.create({
      patientId: session.user.id,
      doctorId: parsed.data.doctorId,
      dateTime: new Date(parsed.data.dateTime),
      type: parsed.data.type,
      facility: parsed.data.facility,
      notes: parsed.data.notes,
    });

    const apptDateStr = new Date(parsed.data.dateTime).toLocaleDateString("fr-BJ", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    const smsAlert = {
      sentTo: session.user.phone,
      message: `CONFIRMATION CARE.BJ: Votre rendez-vous (${parsed.data.type === "teleconsultation" ? "Téléconsultation Vidéo Frugale" : "Présentiel"}) avec Dr. ${doctor.lastName} est confirmé pour le ${apptDateStr} à "${parsed.data.facility}". Rappel SMS prévu 24h avant.`,
    };

    return NextResponse.json({ success: true, appointment: appt, smsAlert }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST appointments:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
