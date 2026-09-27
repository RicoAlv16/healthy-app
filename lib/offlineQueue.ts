"use client";

export interface OfflineMedication {
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface OfflinePrescription {
  id: string;
  tempCode: string;
  patientId: string;
  medications: OfflineMedication[];
  createdAt: string;
  status: "pending_sync" | "syncing" | "synced" | "error";
  syncError?: string;
}

export interface OfflineAppointment {
  id: string;
  doctorId: string;
  dateTime: string;
  type: string;
  facility: string;
  notes?: string;
  createdAt: string;
  status: "pending_sync" | "syncing" | "synced" | "error";
  syncError?: string;
}

const STORAGE_KEY_PRESCRIPTIONS = "care_offline_prescriptions";
const STORAGE_KEY_APPOINTMENTS = "care_offline_appointments";

// --- Gestion des Ordonnances Hors-ligne (Médecin en tournée rurale) ---

export function getOfflinePrescriptions(): OfflinePrescription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESCRIPTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erreur lecture offline prescriptions:", e);
    return [];
  }
}

export function saveOfflinePrescription(data: {
  patientId: string;
  medications: OfflineMedication[];
}): OfflinePrescription {
  const list = getOfflinePrescriptions();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newPrescrip: OfflinePrescription = {
    id: `offline_${Date.now()}_${randomSuffix}`,
    tempCode: `ORD-2G-${randomSuffix}`,
    patientId: data.patientId,
    medications: data.medications,
    createdAt: new Date().toISOString(),
    status: "pending_sync",
  };

  list.unshift(newPrescrip);
  try {
    localStorage.setItem(STORAGE_KEY_PRESCRIPTIONS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("care-offline-queue-changed"));
  } catch (e) {
    console.error("Erreur sauvegarde offline prescription:", e);
  }

  return newPrescrip;
}

export async function syncOfflinePrescriptions(): Promise<{
  successCount: number;
  failedCount: number;
}> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { successCount: 0, failedCount: 0 };
  }

  const list = getOfflinePrescriptions();
  if (list.length === 0) return { successCount: 0, failedCount: 0 };

  const remaining: OfflinePrescription[] = [];
  let successCount = 0;
  let failedCount = 0;

  for (const item of list) {
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: item.patientId,
          medications: item.medications,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        successCount++;
      } else {
        item.status = "error";
        item.syncError = data.message || "Erreur serveur";
        remaining.push(item);
        failedCount++;
      }
    } catch (err: any) {
      item.status = "error";
      item.syncError = err?.message || "Erreur réseau";
      remaining.push(item);
      failedCount++;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY_PRESCRIPTIONS, JSON.stringify(remaining));
    window.dispatchEvent(new CustomEvent("care-offline-queue-changed"));
  } catch (e) {
    console.error("Erreur mise à jour offline prescriptions:", e);
  }

  return { successCount, failedCount };
}

// --- Gestion des Prises de Rendez-vous Hors-ligne ---

export function getOfflineAppointments(): OfflineAppointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erreur lecture offline appointments:", e);
    return [];
  }
}

export function saveOfflineAppointment(data: {
  doctorId: string;
  dateTime: string;
  type: string;
  facility: string;
  notes?: string;
}): OfflineAppointment {
  const list = getOfflineAppointments();
  const newAppt: OfflineAppointment = {
    id: `offline_appt_${Date.now()}`,
    doctorId: data.doctorId,
    dateTime: data.dateTime,
    type: data.type,
    facility: data.facility,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    status: "pending_sync",
  };

  list.unshift(newAppt);
  try {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("care-offline-queue-changed"));
  } catch (e) {
    console.error("Erreur sauvegarde offline appointment:", e);
  }

  return newAppt;
}

export async function syncOfflineAppointments(): Promise<{
  successCount: number;
  failedCount: number;
}> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { successCount: 0, failedCount: 0 };
  }

  const list = getOfflineAppointments();
  if (list.length === 0) return { successCount: 0, failedCount: 0 };

  const remaining: OfflineAppointment[] = [];
  let successCount = 0;
  let failedCount = 0;

  for (const item of list) {
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: item.doctorId,
          dateTime: item.dateTime,
          type: item.type,
          facility: item.facility,
          notes: item.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        successCount++;
      } else {
        item.status = "error";
        item.syncError = data.message || "Erreur serveur";
        remaining.push(item);
        failedCount++;
      }
    } catch (err: any) {
      item.status = "error";
      item.syncError = err?.message || "Erreur réseau";
      remaining.push(item);
      failedCount++;
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(remaining));
    window.dispatchEvent(new CustomEvent("care-offline-queue-changed"));
  } catch (e) {
    console.error("Erreur mise à jour offline appointments:", e);
  }

  return { successCount, failedCount };
}
