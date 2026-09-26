import { NextResponse } from "next/server";
import { userRepository } from "@/lib/db";

export async function GET() {
  try {
    const doctors = await userRepository.findByRole("doctor");
    return NextResponse.json({
      success: true,
      doctors: doctors.map((doc) => ({
        id: doc.id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        professionalId: doc.professionalId,
        email: doc.email,
        phone: doc.phone,
        specialty: doc.professionalId?.includes("5120")
          ? "Pédiatrie & Santé Maternelle"
          : doc.professionalId?.includes("3904")
          ? "Cardiologie & Hypertension"
          : "Médecine Interne & Infectiologie",
        facility: doc.professionalId?.includes("5120")
          ? "CHUMEL Cotonou - Centre Hospitalier Universitaire de la Mère et de l'Enfant"
          : doc.professionalId?.includes("3904")
          ? "CHUD Ouémé-Plateau (Porto-Novo)"
          : "CNHU-HKM Cotonou - Clinique Universitaire de Médecine Interne",
      })),
    });
  } catch (error) {
    console.error("Erreur GET doctors:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des médecins" },
      { status: 500 }
    );
  }
}
