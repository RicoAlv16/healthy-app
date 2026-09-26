import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { vitalSignRepository } from "@/lib/db";
import { z } from "zod";

const vitalSignSchema = z.object({
  type: z.enum(["blood_pressure", "glucose", "heart_rate", "weight", "temperature"]),
  value: z.string().min(1, "Valeur requise"),
  unit: z.string().min(1, "Unité requise"),
  status: z.enum(["normal", "warning", "critical"]).optional().default("normal"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser(request);
    if (!session) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const vitals = await vitalSignRepository.getByUserId(session.user.id);
    return NextResponse.json({ success: true, vitals });
  } catch (error) {
    console.error("Erreur GET vitals:", error);
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
    const parsed = vitalSignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    // Calcul automatique du statut si nécessaire
    let computedStatus = parsed.data.status;
    if (parsed.data.type === "glucose") {
      const g = parseFloat(parsed.data.value);
      if (!isNaN(g)) {
        if (g > 1.4 || g < 0.7) computedStatus = "warning";
        if (g > 2.0 || g < 0.5) computedStatus = "critical";
      }
    } else if (parsed.data.type === "heart_rate") {
      const hr = parseInt(parsed.data.value, 10);
      if (!isNaN(hr)) {
        if (hr > 100 || hr < 50) computedStatus = "warning";
        if (hr > 130 || hr < 40) computedStatus = "critical";
      }
    } else if (parsed.data.type === "blood_pressure") {
      const parts = parsed.data.value.split("/");
      if (parts.length === 2) {
        const sys = parseInt(parts[0], 10);
        const dia = parseInt(parts[1], 10);
        if (!isNaN(sys) && !isNaN(dia)) {
          if (sys >= 14 || dia >= 9) computedStatus = "warning";
          if (sys >= 18 || dia >= 11) computedStatus = "critical";
        }
      }
    }

    const vital = await vitalSignRepository.add({
      userId: session.user.id,
      type: parsed.data.type,
      value: parsed.data.value,
      unit: parsed.data.unit,
      status: computedStatus,
    });

    return NextResponse.json({ success: true, vital }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST vitals:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
