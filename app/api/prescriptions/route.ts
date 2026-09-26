import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prescriptionRepository, userRepository } from "@/lib/db";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import crypto from "crypto";

const medicationSchema = z.object({
  name: z.string().min(1, "Nom du médicament requis"),
  dosage: z.string().min(1, "Posologie requise"),
  duration: z.string().min(1, "Durée requise"),
  quantity: z.string().optional(),
  instructions: z.string().optional(),
});

const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient requis"),
  pharmacyId: z.string().optional(),
  medications: z.array(medicationSchema).min(1, "Au moins un médicament requis"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    if (session.user.role === "doctor") {
      const prescriptions = await prescriptionRepository.getByDoctorId(session.user.id);
      return NextResponse.json({ success: true, prescriptions });
    }

    if (session.user.role === "pharmacy") {
      const prescriptions = await prescriptionRepository.getByPharmacyId(session.user.id);
      return NextResponse.json({ success: true, prescriptions });
    }

    const prescriptions = await prescriptionRepository.getByPatientId(session.user.id);
    return NextResponse.json({ success: true, prescriptions });
  } catch (error) {
    console.error("Erreur GET prescriptions:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Action réservée aux praticiens médicaux assermentés" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createPrescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    // Vérifier l'existence du patient
    const patient = await userRepository.findById(parsed.data.patientId);
    if (!patient) {
      return NextResponse.json({ success: false, message: "Patient introuvable" }, { status: 404 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `ORD-2026-${randomSuffix}`;
    const sig = crypto.randomBytes(4).toString("hex").toUpperCase();
    const qrHash = `CAREBJ:ORD:2026-${randomSuffix}:NPI-${patient.npi || patient.id}:DR-${session.user.professionalId || session.user.id}:SIG-${sig}`;

    const created = await prisma.prescription.create({
      data: {
        code,
        patientId: patient.id,
        doctorId: session.user.id,
        pharmacyId: parsed.data.pharmacyId || null,
        status: "active",
        qrHash,
        medications: parsed.data.medications,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            npi: true,
            phone: true,
            bloodGroup: true,
            archNumber: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, prescription: created }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST prescriptions:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
