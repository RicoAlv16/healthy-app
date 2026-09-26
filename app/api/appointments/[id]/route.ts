import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { appointmentRepository } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["scheduled", "confirmed", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ success: false, message: "Statut invalide" }, { status: 400 });
    }

    await appointmentRepository.updateStatus(id, status);

    return NextResponse.json({ success: true, message: "Statut mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur PATCH appointment:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    await appointmentRepository.delete(id);

    return NextResponse.json({ success: true, message: "Rendez-vous annulé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE appointment:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}

