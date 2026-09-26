import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { emergencyAccessRepository, userRepository } from "@/lib/db";
import { z } from "zod";

const breakGlassSchema = z.object({
  patientId: z.string().min(1, "Identifiant du patient requis"),
  facility: z.string().min(1, "Établissement ou service d'urgence requis"),
  reason: z.string().min(30, "La justification clinique d'urgence doit comporter au moins 30 caractères"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session || (session.user.role !== "doctor" && session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Action réservée aux praticiens et urgentistes assermentés" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = breakGlassSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const patient = await userRepository.findById(parsed.data.patientId);
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient introuvable dans le registre national" },
        { status: 404 }
      );
    }

    // Enregistrement de l'accès exceptionnel d'urgence
    const log = await emergencyAccessRepository.create({
      patientId: patient.id,
      doctorId: session.user.id,
      facility: parsed.data.facility,
      reason: parsed.data.reason,
    });

    const smsText = `ALERTE CARE.BJ: Un déverrouillage d'urgence (Bris de Glace) de votre dossier médical a été effectué par Dr. ${session.user.lastName} (${parsed.data.facility}) le ${new Date().toLocaleDateString("fr-BJ")}. Motif: "${parsed.data.reason}". Si vous n'êtes pas à l'origine de cette prise en charge, contactez immédiatement l'APDP Bénin.`;

    return NextResponse.json({
      success: true,
      message: "Procédure Bris de Glace validée. Dossier médical déverrouillé.",
      log,
      smsAlert: {
        sentTo: patient.phone,
        message: smsText,
      },
    });
  } catch (error) {
    console.error("Erreur break-glass:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
