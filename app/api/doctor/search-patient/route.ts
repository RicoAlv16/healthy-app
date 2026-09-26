import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { 
  userRepository, 
  vitalSignRepository, 
  prescriptionRepository, 
  appointmentRepository,
  vaccinationRepository,
  emergencyAccessRepository 
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session || (session.user.role !== "doctor" && session.user.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Accès réservé au corps médical habilité" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Identifiant NPI ou nom requis pour la recherche" },
        { status: 400 }
      );
    }

    const patient = await userRepository.findByIdentifier(query);
    if (!patient || patient.role !== "patient") {
      return NextResponse.json(
        { success: false, message: "Aucun dossier patient correspondant trouvé dans le registre ANIP." },
        { status: 404 }
      );
    }

    const [vitals, prescriptions, appointments, vaccinations, emergencyAccessLogs] = await Promise.all([
      vitalSignRepository.getByUserId(patient.id),
      prescriptionRepository.getByPatientId(patient.id),
      appointmentRepository.getByPatientId(patient.id),
      vaccinationRepository.getByUserId(patient.id),
      emergencyAccessRepository.getByPatientId(patient.id),
    ]);

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        npi: patient.npi,
        phone: patient.phone,
        email: patient.email,
        bloodGroup: patient.bloodGroup,
        archNumber: patient.archNumber,
        emergencyContact: patient.emergencyContact,
        allergies: patient.allergies,
      },
      vitals,
      prescriptions,
      appointments,
      vaccinations,
      emergencyAccessLogs,
    });
  } catch (error) {
    console.error("Erreur recherche patient:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
