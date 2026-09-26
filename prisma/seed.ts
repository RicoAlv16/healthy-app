import { Role } from "@prisma/client";
import { prisma } from "../lib/db/prisma";

async function main() {
  console.log("🌱 Début du peuplement de la base de données Care.bj (PostgreSQL)...");

  // 1. Patient citoyen test
  const patient = await prisma.user.upsert({
    where: { email: "bio.kora@citoyen.bj" },
    update: {},
    create: {
      id: "usr_patient_001",
      role: Role.PATIENT,
      firstName: "Bio Kora",
      lastName: "BIO",
      email: "bio.kora@citoyen.bj",
      phone: "+229 97 12 34 56",
      // Mot de passe : BeninSante@2026
      passwordHash: "$2b$10$JxvPhqMHVPw3vJSkLdl6PerHuoifuvzRe8padBI4jnHvXf7G26TyS",
      npi: "1092-8472-9104",
      archNumber: "ARCH-BJ-2024-8841",
      bloodGroup: "O+",
      allergies: ["Pénicilline"],
      emergencyContact: "Mme Chantal BIO (+229 97 00 11 22)",
      isVerified: true,
    },
  });
  console.log(`✅ Patient créé : ${patient.firstName} ${patient.lastName} (NPI: ${patient.npi})`);

  // 2. Médecin CNHU test
  const doctor = await prisma.user.upsert({
    where: { email: "dr.agbo@cnhu.bj" },
    update: {},
    create: {
      id: "usr_doctor_001",
      role: Role.DOCTOR,
      firstName: "Florent",
      lastName: "AGBO",
      email: "dr.agbo@cnhu.bj",
      phone: "+229 95 44 33 22",
      // Mot de passe : DoctorPass@2026
      passwordHash: "$2b$10$ybrOgnLuz0Fh0BLsXig.WOy9US7nX6WbTJPuGlMa1WWDXaZj0Nyty",
      npi: "9876-5432-1098",
      professionalId: "ONMB-4812",
      isVerified: true,
    },
  });
  console.log(`✅ Médecin créé : Dr. ${doctor.firstName} ${doctor.lastName} (Ordre: ${doctor.professionalId})`);

  // 3. Pharmacie Camp Guézo test
  const pharmacy = await prisma.user.upsert({
    where: { email: "contact@pharmacie-guezo.bj" },
    update: {},
    create: {
      id: "usr_pharmacy_001",
      role: Role.PHARMACY,
      firstName: "Amina",
      lastName: "SOUROU",
      email: "contact@pharmacie-guezo.bj",
      phone: "+229 96 88 77 66",
      // Mot de passe : Pharmacie@2026
      passwordHash: "$2b$10$T9k.CuJ9XxRwh./4lQHRAOA8ULqN0N00EavwoXOoe29B1Bdaqy7jS",
      npi: "5432-1098-7654",
      professionalId: "ABMED-OFFICINE-2024-082",
      isVerified: true,
    },
  });
  console.log(`✅ Pharmacie créée : ${pharmacy.firstName} ${pharmacy.lastName} (Agrément: ${pharmacy.professionalId})`);

  // 4. Signes vitaux réels pour le patient
  const vitals = [
    { type: "blood_pressure", value: "12/8", unit: "mmHg", status: "normal" },
    { type: "glucose", value: "0.95", unit: "g/L", status: "normal" },
    { type: "heart_rate", value: "72", unit: "bpm", status: "normal" },
    { type: "weight", value: "71.4", unit: "kg", status: "normal" },
    { type: "temperature", value: "36.8", unit: "°C", status: "normal" },
  ];

  // Nettoyage et insertion des signes vitaux pour éviter doublons au re-seed
  await prisma.vitalSign.deleteMany({ where: { userId: patient.id } });
  for (const v of vitals) {
    await prisma.vitalSign.create({
      data: {
        userId: patient.id,
        type: v.type,
        value: v.value,
        unit: v.unit,
        status: v.status,
      },
    });
  }
  console.log(`✅ ${vitals.length} constantes vitales enregistrées pour ${patient.firstName}`);

  // 5. Rendez-vous médical (CNHU-HKM Cotonou)
  await prisma.appointment.deleteMany({ where: { patientId: patient.id } });
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // Dans 2 jours à 10h
      type: "in_person",
      status: "confirmed",
      facility: "CNHU-HKM Cotonou - Clinique Universitaire de Médecine Interne",
      notes: "Contrôle de routine trimestriel et suivi tensionnel.",
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Dans 10 jours
      type: "teleconsultation",
      status: "scheduled",
      facility: "Téléconsultation sécurisée Care.bj",
      notes: "Bilan biologique et lecture des analyses de laboratoire.",
    },
  });
  console.log(`✅ 2 rendez-vous créés pour le patient avec Dr. ${doctor.lastName}`);

  // 6. Ordonnance électronique souveraine (E-Prescription) avec QR sécurisé
  await prisma.prescription.deleteMany({ where: { patientId: patient.id } });
  const prescription = await prisma.prescription.create({
    data: {
      code: "ORD-2026-8841",
      patientId: patient.id,
      doctorId: doctor.id,
      pharmacyId: pharmacy.id,
      status: "active",
      qrHash: "CAREBJ:ORD:2026-8841:NPI-109284729104:DR-ONMB-4812:SIG-E89AF4C3",
      medications: [
        {
          name: "Amoxicilline 500mg",
          dosage: "1 gélule 3 fois par jour au milieu des repas",
          duration: "7 jours",
          quantity: "2 boîtes",
          instructions: "Ne pas interrompre avant le terme même en cas d'amélioration",
        },
        {
          name: "Paracétamol Biogaran 1000mg",
          dosage: "1 comprimé toutes les 6 heures en cas de douleur ou fièvre",
          duration: "5 jours",
          quantity: "1 boîte",
          instructions: "Maximum 3g par jour",
        },
        {
          name: "Sérum Physiologique stérile (dosettes)",
          dosage: "1 lavage nasal matin et soir",
          duration: "10 jours",
          quantity: "1 boîte de 30 unidoses",
          instructions: "Voie nasale stricte",
        },
      ],
    },
  });
  console.log(`✅ Ordonnance électronique active créée : ${prescription.code}`);

  console.log("🚀 Base de données PostgreSQL Care.bj initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
