import { NextRequest, NextResponse } from "next/server";
import { otpRepository, userRepository } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, phone, role, purpose = "login" } = body;

    const targetPhone = phone?.trim();
    const targetIdentifier = identifier?.trim();

    if (!targetPhone && !targetIdentifier) {
      return NextResponse.json(
        {
          success: false,
          message: "Un numéro de téléphone (+229) ou un NPI / identifiant est requis.",
        },
        { status: 400 }
      );
    }

    // Dans le cas d'une connexion (login) : contrôle strict d'existence en base de données
    if (purpose === "login") {
      let matchedUser = null;

      // 1. Recherche par NPI / Identifiant si fourni
      if (targetIdentifier) {
        const userById = await userRepository.findByIdentifier(targetIdentifier);
        if (!userById) {
          return NextResponse.json(
            {
              success: false,
              message:
                role === "doctor"
                  ? "Numéro d'Ordre ou identifiant médecin non reconnu dans la base."
                  : role === "pharmacy"
                  ? "Numéro d'Agrément ou identifiant pharmacie non reconnu dans la base."
                  : "Numéro Personnel d'Identification (NPI ANIP) non trouvé en base.",
            },
            { status: 404 }
          );
        }
        matchedUser = userById;
      }

      // 2. Recherche par téléphone si fourni
      if (targetPhone) {
        const userByPhone = await userRepository.findByPhone(targetPhone);
        if (!userByPhone) {
          return NextResponse.json(
            {
              success: false,
              message: `Aucun compte associé au numéro de téléphone ${targetPhone} dans la base.`,
            },
            { status: 404 }
          );
        }

        // Si on a recherché à la fois par identifiant et par téléphone, vérifier la concordance
        if (matchedUser && matchedUser.id !== userByPhone.id) {
          return NextResponse.json(
            {
              success: false,
              message: "Le numéro de téléphone ne correspond pas au NPI / identifiant renseigné.",
            },
            { status: 400 }
          );
        }

        matchedUser = userByPhone;
      }

      // 3. Vérification de la concordance du rôle sélectionné
      if (matchedUser && role && matchedUser.role !== role) {
        return NextResponse.json(
          {
            success: false,
            message: `Ce compte est enregistré comme ${
              matchedUser.role === "doctor"
                ? "Médecin"
                : matchedUser.role === "pharmacy"
                ? "Pharmacie"
                : "Patient"
            }, et non comme ${
              role === "doctor"
                ? "Médecin"
                : role === "pharmacy"
                ? "Pharmacie"
                : "Patient"
            }.`,
          },
          { status: 403 }
        );
      }
    }

    // Le destinataire de l'OTP est de préférence le numéro de téléphone
    const recipient = targetPhone || targetIdentifier;

    // Génération d'un code secret aléatoire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Enregistrement sécurisé dans la table PostgreSQL 'otp_records' (durée de validité : 5 min)
    await otpRepository.create(recipient, purpose, code, 5);

    // Journalisation de la simulation passerelle SMS
    console.log(
      `\n========================================\n` +
      `[SMS GATEWAY BÉNIN - SIMULATION]\n` +
      `Destinataire : ${recipient}\n` +
      `Code OTP généré : >>> ${code} <<<\n` +
      `Usage : ${purpose}\n` +
      `Valable : 5 minutes\n` +
      `========================================\n`
    );

    return NextResponse.json({
      success: true,
      message: `Code de sécurité envoyé avec succès par SMS au ${recipient}.`,
      expiresInMinutes: 5,
    });
  } catch (error) {
    console.error("Erreur API OTP Send :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Impossible d'acheminer le code SMS pour le moment.",
      },
      { status: 500 }
    );
  }
}
