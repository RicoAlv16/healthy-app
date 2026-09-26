import { Role, User as PrismaUser } from "@prisma/client";
import { prisma } from "./prisma";
import crypto from "crypto";

export type UserRole = "patient" | "doctor" | "pharmacy" | "admin";

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  npi?: string | null;
  professionalId?: string | null;
  archNumber?: string | null;
  bloodGroup?: string | null;
  emergencyContact?: string | null;
  allergies: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<User, "passwordHash">;

export interface OtpRecord {
  id: string;
  identifier: string;
  code: string;
  purpose: "login" | "register" | "reset-password";
  expiresAt: string;
  attempts: number;
  verified: boolean;
  createdAt: string;
}

export interface VitalSignRecord {
  id: string;
  userId: string;
  type: string;
  value: string;
  unit: string;
  status: string;
  measuredAt: string;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  duration: string;
  quantity?: string;
  instructions?: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  type: string;
  status: string;
  facility: string;
  notes?: string | null;
  createdAt: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    professionalId?: string | null;
  };
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    npi?: string | null;
    phone: string;
    bloodGroup?: string | null;
    archNumber?: string | null;
  };
}

export interface PrescriptionRecord {
  id: string;
  code: string;
  patientId: string;
  doctorId: string;
  pharmacyId?: string | null;
  status: string;
  medications: MedicationItem[];
  qrHash: string;
  issuedAt: string;
  dispensedAt?: string | null;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    professionalId?: string | null;
  };
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    npi?: string | null;
    phone: string;
    bloodGroup?: string | null;
    archNumber?: string | null;
  };
  pharmacy?: {
    id: string;
    firstName: string;
    lastName: string;
    professionalId?: string | null;
  } | null;
}

// Convertisseur Rôle Prisma (Enum MAJUSCULE) <-> Rôle Métier (minuscule)
function toPrismaRole(role: UserRole): Role {
  switch (role) {
    case "doctor":
      return Role.DOCTOR;
    case "pharmacy":
      return Role.PHARMACY;
    case "admin":
      return Role.ADMIN;
    default:
      return Role.PATIENT;
  }
}

function fromPrismaRole(role: Role): UserRole {
  switch (role) {
    case Role.DOCTOR:
      return "doctor";
    case Role.PHARMACY:
      return "pharmacy";
    case Role.ADMIN:
      return "admin";
    default:
      return "patient";
  }
}

function mapPrismaUser(u: PrismaUser): User {
  return {
    id: u.id,
    role: fromPrismaRole(u.role),
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    passwordHash: u.passwordHash,
    npi: u.npi,
    professionalId: u.professionalId,
    archNumber: u.archNumber,
    bloodGroup: u.bloodGroup,
    emergencyContact: u.emergencyContact,
    allergies: u.allergies,
    isVerified: u.isVerified,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

// Normalisation pour recherche tolérante
function normalizeIdentifier(str: string): string {
  return str.toLowerCase().replace(/[\s\-_]/g, "");
}

// Nettoyage de l'utilisateur pour l'exposer publiquement
export function sanitizeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

// Repository Utilisateurs connecté à PostgreSQL via Prisma
export const userRepository = {
  async getAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users.map(mapPrismaUser);
  },

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? mapPrismaUser(user) : null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: "insensitive",
        },
      },
    });
    return user ? mapPrismaUser(user) : null;
  },

  async findByPhone(phone: string): Promise<User | null> {
    const norm = normalizeIdentifier(phone);
    const users = await prisma.user.findMany();
    const found = users.find((u) => normalizeIdentifier(u.phone) === norm);
    return found ? mapPrismaUser(found) : null;
  },

  async findByNpi(npi: string): Promise<User | null> {
    const norm = normalizeIdentifier(npi);
    const users = await prisma.user.findMany({
      where: { npi: { not: null } },
    });
    const found = users.find((u) => u.npi && normalizeIdentifier(u.npi) === norm);
    return found ? mapPrismaUser(found) : null;
  },

  /**
   * Recherche par identifiant universel : Email, Téléphone, NPI ANIP ou N° d'Ordre
   */
  async findByIdentifier(identifier: string): Promise<User | null> {
    const clean = identifier.trim();
    const norm = normalizeIdentifier(clean);

    // 1. Essai direct par email (insensible à la casse)
    const byEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: clean,
          mode: "insensitive",
        },
      },
    });
    if (byEmail) return mapPrismaUser(byEmail);

    // 2. Recherche tolérante sur les autres identifiants
    const users = await prisma.user.findMany();
    const found = users.find((u) => {
      if (normalizeIdentifier(u.phone) === norm) return true;
      if (u.npi && normalizeIdentifier(u.npi) === norm) return true;
      if (u.professionalId && normalizeIdentifier(u.professionalId) === norm) return true;
      return false;
    });

    return found ? mapPrismaUser(found) : null;
  },

  async create(data: {
    role: UserRole;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;
    npi?: string;
    professionalId?: string;
    archNumber?: string;
    bloodGroup?: string;
    emergencyContact?: string;
    allergies?: string[];
    isVerified?: boolean;
  }): Promise<User> {
    const created = await prisma.user.create({
      data: {
        role: toPrismaRole(data.role),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        passwordHash: data.passwordHash,
        npi: data.npi?.trim() || null,
        professionalId: data.professionalId?.trim() || null,
        archNumber: data.archNumber?.trim() || null,
        bloodGroup: data.bloodGroup || null,
        emergencyContact: data.emergencyContact?.trim() || null,
        allergies: data.allergies || [],
        isVerified: data.isVerified ?? true,
      },
    });

    return mapPrismaUser(created);
  },

  async update(
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<User | null> {
    const data: Record<string, unknown> = {};
    if (updates.firstName !== undefined) data.firstName = updates.firstName;
    if (updates.lastName !== undefined) data.lastName = updates.lastName;
    if (updates.email !== undefined) data.email = updates.email.trim().toLowerCase();
    if (updates.phone !== undefined) data.phone = updates.phone.trim();
    if (updates.passwordHash !== undefined) data.passwordHash = updates.passwordHash;
    if (updates.npi !== undefined) data.npi = updates.npi;
    if (updates.professionalId !== undefined) data.professionalId = updates.professionalId;
    if (updates.archNumber !== undefined) data.archNumber = updates.archNumber;
    if (updates.bloodGroup !== undefined) data.bloodGroup = updates.bloodGroup;
    if (updates.emergencyContact !== undefined) data.emergencyContact = updates.emergencyContact;
    if (updates.allergies !== undefined) data.allergies = updates.allergies;
    if (updates.isVerified !== undefined) data.isVerified = updates.isVerified;
    if (updates.role !== undefined) data.role = toPrismaRole(updates.role);

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return mapPrismaUser(updated);
  },
};

// Repository OTP connecté à PostgreSQL via Prisma
export const otpRepository = {
  async create(
    identifier: string,
    purpose: "login" | "register" | "reset-password",
    forcedCode?: string,
    ttlMinutes = 5
  ): Promise<OtpRecord> {
    const cleanIdentifier = identifier.trim();

    // Invalider les OTP précédents non vérifiés
    await prisma.otpRecord.deleteMany({
      where: {
        identifier: cleanIdentifier,
        purpose,
        verified: false,
      },
    });

    const code =
      forcedCode ||
      Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const record = await prisma.otpRecord.create({
      data: {
        id: `otp_${crypto.randomUUID().slice(0, 8)}`,
        identifier: cleanIdentifier,
        code,
        purpose,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    return {
      id: record.id,
      identifier: record.identifier,
      code: record.code,
      purpose: record.purpose as "login" | "register" | "reset-password",
      expiresAt: record.expiresAt.toISOString(),
      attempts: record.attempts,
      verified: record.verified,
      createdAt: record.createdAt.toISOString(),
    };
  },

  async verify(
    identifier: string,
    code: string,
    purpose: "login" | "register" | "reset-password"
  ): Promise<{ valid: boolean; message?: string }> {
    const cleanIdentifier = identifier.trim();
    const now = new Date();

    const record = await prisma.otpRecord.findFirst({
      where: {
        identifier: cleanIdentifier,
        purpose,
        verified: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return { valid: false, message: "Aucun code en attente ou code déjà utilisé." };
    }

    if (record.expiresAt < now) {
      return { valid: false, message: "Ce code a expiré. Veuillez en redemander un nouveau." };
    }

    if (record.attempts >= 5) {
      return { valid: false, message: "Nombre maximal de tentatives dépassé pour ce code." };
    }

    if (record.code !== code.trim()) {
      await prisma.otpRecord.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      return { valid: false, message: "Code secret incorrect." };
    }

    // Validation du code
    await prisma.otpRecord.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return { valid: true };
  },
};

// Repository Signes Vitaux connecté à PostgreSQL via Prisma
export const vitalSignRepository = {
  async getByUserId(userId: string): Promise<VitalSignRecord[]> {
    const items = await prisma.vitalSign.findMany({
      where: { userId },
      orderBy: { measuredAt: "desc" },
    });

    return items.map((i) => ({
      id: i.id,
      userId: i.userId,
      type: i.type,
      value: i.value,
      unit: i.unit,
      status: i.status,
      measuredAt: i.measuredAt.toISOString(),
    }));
  },

  async add(data: {
    userId: string;
    type: string;
    value: string;
    unit: string;
    status?: string;
  }): Promise<VitalSignRecord> {
    const created = await prisma.vitalSign.create({
      data: {
        userId: data.userId,
        type: data.type,
        value: data.value,
        unit: data.unit,
        status: data.status || "normal",
      },
    });

    return {
      id: created.id,
      userId: created.userId,
      type: created.type,
      value: created.value,
      unit: created.unit,
      status: created.status,
      measuredAt: created.measuredAt.toISOString(),
    };
  },
};

// Repository Rendez-vous médicaux connecté à PostgreSQL via Prisma
export const appointmentRepository = {
  async getByPatientId(patientId: string): Promise<AppointmentRecord[]> {
    const items = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
      },
      orderBy: { dateTime: "asc" },
    });

    return items.map((a) => ({
      id: a.id,
      patientId: a.patientId,
      doctorId: a.doctorId,
      dateTime: a.dateTime.toISOString(),
      type: a.type,
      status: a.status,
      facility: a.facility,
      notes: a.notes,
      createdAt: a.createdAt.toISOString(),
      doctor: a.doctor,
    }));
  },

  async getByDoctorId(doctorId: string): Promise<AppointmentRecord[]> {
    const items = await prisma.appointment.findMany({
      where: { doctorId },
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
      },
      orderBy: { dateTime: "asc" },
    });

    return items.map((a) => ({
      id: a.id,
      patientId: a.patientId,
      doctorId: a.doctorId,
      dateTime: a.dateTime.toISOString(),
      type: a.type,
      status: a.status,
      facility: a.facility,
      notes: a.notes,
      createdAt: a.createdAt.toISOString(),
      patient: a.patient,
    }));
  },

  async create(data: {
    patientId: string;
    doctorId: string;
    dateTime: Date;
    type?: string;
    facility: string;
    notes?: string;
  }): Promise<AppointmentRecord> {
    const created = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        dateTime: data.dateTime,
        type: data.type || "in_person",
        facility: data.facility,
        notes: data.notes || null,
        status: "confirmed",
      },
      include: {
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

    return {
      id: created.id,
      patientId: created.patientId,
      doctorId: created.doctorId,
      dateTime: created.dateTime.toISOString(),
      type: created.type,
      status: created.status,
      facility: created.facility,
      notes: created.notes,
      createdAt: created.createdAt.toISOString(),
      doctor: created.doctor,
    };
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await prisma.appointment.update({
      where: { id },
      data: { status },
    });
  },
};

// Repository Ordonnances Médicales connecté à PostgreSQL via Prisma
export const prescriptionRepository = {
  async getByPatientId(patientId: string): Promise<PrescriptionRecord[]> {
    const items = await prisma.prescription.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
        pharmacy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    });

    return items.map((p) => ({
      id: p.id,
      code: p.code,
      patientId: p.patientId,
      doctorId: p.doctorId,
      pharmacyId: p.pharmacyId,
      status: p.status,
      medications: p.medications as unknown as MedicationItem[],
      qrHash: p.qrHash,
      issuedAt: p.issuedAt.toISOString(),
      dispensedAt: p.dispensedAt?.toISOString() || null,
      doctor: p.doctor,
      pharmacy: p.pharmacy,
    }));
  },

  async getByDoctorId(doctorId: string): Promise<PrescriptionRecord[]> {
    const items = await prisma.prescription.findMany({
      where: { doctorId },
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
      },
      orderBy: { issuedAt: "desc" },
    });

    return items.map((p) => ({
      id: p.id,
      code: p.code,
      patientId: p.patientId,
      doctorId: p.doctorId,
      pharmacyId: p.pharmacyId,
      status: p.status,
      medications: p.medications as unknown as MedicationItem[],
      qrHash: p.qrHash,
      issuedAt: p.issuedAt.toISOString(),
      dispensedAt: p.dispensedAt?.toISOString() || null,
      patient: p.patient,
    }));
  },

  async getByPharmacyId(pharmacyId: string): Promise<PrescriptionRecord[]> {
    const items = await prisma.prescription.findMany({
      where: {
        OR: [
          { pharmacyId },
          { status: "active" },
        ],
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
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
      },
      orderBy: { issuedAt: "desc" },
    });

    return items.map((p) => ({
      id: p.id,
      code: p.code,
      patientId: p.patientId,
      doctorId: p.doctorId,
      pharmacyId: p.pharmacyId,
      status: p.status,
      medications: p.medications as unknown as MedicationItem[],
      qrHash: p.qrHash,
      issuedAt: p.issuedAt.toISOString(),
      dispensedAt: p.dispensedAt?.toISOString() || null,
      doctor: p.doctor,
      patient: p.patient,
    }));
  },

  async findByCode(code: string): Promise<PrescriptionRecord | null> {
    const p = await prisma.prescription.findUnique({
      where: { code },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
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
        pharmacy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
      },
    });

    if (!p) return null;

    return {
      id: p.id,
      code: p.code,
      patientId: p.patientId,
      doctorId: p.doctorId,
      pharmacyId: p.pharmacyId,
      status: p.status,
      medications: p.medications as unknown as MedicationItem[],
      qrHash: p.qrHash,
      issuedAt: p.issuedAt.toISOString(),
      dispensedAt: p.dispensedAt?.toISOString() || null,
      doctor: p.doctor,
      patient: p.patient,
      pharmacy: p.pharmacy,
    };
  },

  async dispense(id: string, pharmacyId: string): Promise<PrescriptionRecord> {
    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        status: "dispensed",
        pharmacyId,
        dispensedAt: new Date(),
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            professionalId: true,
          },
        },
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
      },
    });

    return {
      id: updated.id,
      code: updated.code,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      pharmacyId: updated.pharmacyId,
      status: updated.status,
      medications: updated.medications as unknown as MedicationItem[],
      qrHash: updated.qrHash,
      issuedAt: updated.issuedAt.toISOString(),
      dispensedAt: updated.dispensedAt?.toISOString() || null,
      doctor: updated.doctor,
      patient: updated.patient,
    };
  },
};

