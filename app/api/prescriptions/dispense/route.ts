import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prescriptionRepository } from "@/lib/db";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session || session.user.role !== "pharmacy") {
      return NextResponse.json(
        { success: false, message: "Action réservée aux officines et pharmacies agréées" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { code, qrHash } = body;

    if (!code && !qrHash) {
      return NextResponse.json(
        { success: false, message: "Numéro d'ordonnance ou hash QR requis" },
        { status: 400 }
      );
    }

    // Recherche de l'ordonnance dans PostgreSQL
    let prescription = null;
    if (code) {
      prescription = await prisma.prescription.findUnique({
        where: { code: code.trim().toUpperCase() },
      });
    } else if (qrHash) {
      prescription = await prisma.prescription.findFirst({
        where: { qrHash: qrHash.trim() },
      });
    }

    if (!prescription) {
      return NextResponse.json(
        { success: false, message: "Ordonnance électronique introuvable dans le registre national" },
        { status: 404 }
      );
    }

    if (prescription.status === "dispensed") {
      return NextResponse.json(
        {
          success: false,
          message: `Cette ordonnance a déjà été délivrée le ${new Date(prescription.dispensedAt || Date.now()).toLocaleDateString("fr-BJ")} et ne peut plus être réutilisée.`,
        },
        { status: 400 }
      );
    }

    const dispensed = await prescriptionRepository.dispense(prescription.id, session.user.id);

    return NextResponse.json({
      success: true,
      message: "Délivrance validée avec succès. Enregistrée dans le registre e-Santé Bénin.",
      prescription: dispensed,
    });
  } catch (error) {
    console.error("Erreur dispense prescription:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
