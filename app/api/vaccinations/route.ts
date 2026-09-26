import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { vaccinationRepository } from "@/lib/db";
import { z } from "zod";

const createVaccinationSchema = z.object({
  patientId: z.string().optional(),
  vaccineName: z.string().min(1, "Nom du vaccin requis"),
  diseaseTarget: z.string().min(1, "Maladie ciblée requise"),
  dose: z.string().min(1, "Dose requise"),
  status: z.enum(["administered", "scheduled", "overdue"]).default("administered"),
  administeredAt: z.string().optional(),
  batchNumber: z.string().optional(),
  facility: z.string().optional(),
  administeredBy: z.string().optional(),
  nextDueDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId =
      (session.user.role === "doctor" && searchParams.get("patientId")) || session.user.id;

    const vaccinations = await vaccinationRepository.getByUserId(targetUserId);
    return NextResponse.json({ success: true, vaccinations });
  } catch (error) {
    console.error("Erreur GET vaccinations:", error);
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
    const parsed = createVaccinationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const targetUserId =
      (session.user.role === "doctor" && parsed.data.patientId) || session.user.id;

    const record = await vaccinationRepository.add({
      userId: targetUserId,
      vaccineName: parsed.data.vaccineName,
      diseaseTarget: parsed.data.diseaseTarget,
      dose: parsed.data.dose,
      status: parsed.data.status,
      administeredAt: parsed.data.administeredAt ? new Date(parsed.data.administeredAt) : new Date(),
      batchNumber: parsed.data.batchNumber || null || undefined,
      facility: parsed.data.facility || (session.user.role === "doctor" ? "CNHU-HKM Cotonou" : "Centre de Santé"),
      administeredBy: parsed.data.administeredBy || (session.user.role === "doctor" ? `Dr. ${session.user.lastName}` : "Agent PEV"),
      nextDueDate: parsed.data.nextDueDate ? new Date(parsed.data.nextDueDate) : undefined,
    });

    return NextResponse.json({ success: true, vaccination: record }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST vaccinations:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
