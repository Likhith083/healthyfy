"use client";

import type { AppData, User, DoctorProfile, PatientData, Appointment, UserRole } from "@/types";
import { getLocalStorageItem, setLocalStorageItem } from "./localStorage";

const APP_DATA_KEY = "healthMatchDirectData";

const initialAdminUser: User = {
  id: "admin001",
  email: "admin@healthmatch.direct",
  password: "adminpassword", // In a real app, this would be hashed
  name: "Admin User",
  role: "admin",
};

const initialDoctors: User[] = [
  { id: "doc001", email: "cardio@healthmatch.direct", password: "password123", name: "Dr. Eve Heartwell", role: "doctor" },
  { id: "doc002", email: "derma@healthmatch.direct", password: "password123", name: "Dr. Adam Skinnerton", role: "doctor" },
  { id: "doc003", email: "gp@healthmatch.direct", password: "password123", name: "Dr. John Citizen", role: "doctor" },
];

const initialDoctorProfiles: DoctorProfile[] = [
  { userId: "doc001", specialization: "Cardiologist", bio: "Expert in heart-related issues.", profilePictureUrl: "https://placehold.co/100x100.png", availability: "Mon, Wed, Fri 9am-5pm" },
  { userId: "doc002", specialization: "Dermatologist", bio: "Specializes in skin conditions.", profilePictureUrl: "https://placehold.co/100x100.png", availability: "Tue, Thu 10am-6pm" },
  { userId: "doc003", specialization: "General Physician", bio: "Provides general medical care.", profilePictureUrl: "https://placehold.co/100x100.png", availability: "Mon-Fri 8am-4pm" },
];

const defaultAppData: AppData = {
  users: [initialAdminUser, ...initialDoctors],
  doctorProfiles: initialDoctorProfiles,
  patientData: [],
  appointments: [],
};

export function getAppData(): AppData {
  return getLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);
}

export function saveAppData(data: AppData): void {
  setLocalStorageItem<AppData>(APP_DATA_KEY, data);
}

// Initialize data if it doesn't exist
if (typeof window !== "undefined") {
  const currentData = window.localStorage.getItem(APP_DATA_KEY);
  if (!currentData) {
    saveAppData(defaultAppData);
  }
}

// --- User Management ---
export function findUserByEmail(email: string): User | undefined {
  const { users } = getAppData();
  return users.find(user => user.email === email);
}

export function findUserById(userId: string): User | undefined {
  const { users } = getAppData();
  return users.find(user => user.id === userId);
}

export function addUser(user: Omit<User, 'id'>): User {
  const appData = getAppData();
  const newUser: User = { ...user, id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}` };
  appData.users.push(newUser);
  saveAppData(appData);
  return newUser;
}

export function updateUser(updatedUser: User): void {
  const appData = getAppData();
  appData.users = appData.users.map(u => u.id === updatedUser.id ? updatedUser : u);
  saveAppData(appData);
}

export function getUsers(role?: UserRole): User[] {
  const { users } = getAppData();
  if (role) {
    return users.filter(user => user.role === role);
  }
  return users;
}

export function removeUser(userId: string): void {
  const appData = getAppData();
  appData.users = appData.users.filter(u => u.id !== userId);
  // Also remove related data (doctor profile, patient data, appointments)
  appData.doctorProfiles = appData.doctorProfiles.filter(dp => dp.userId !== userId);
  appData.patientData = appData.patientData.filter(pd => pd.userId !== userId);
  appData.appointments = appData.appointments.filter(ap => ap.patientId !== userId && ap.doctorId !== userId);
  saveAppData(appData);
}


// --- Doctor Profile Management ---
export function getDoctorProfile(userId: string): DoctorProfile | undefined {
  const { doctorProfiles } = getAppData();
  return doctorProfiles.find(profile => profile.userId === userId);
}

export function getAllDoctorProfiles(): DoctorProfile[] {
  const { doctorProfiles } = getAppData();
  return doctorProfiles;
}

export function addDoctorProfile(profile: DoctorProfile): void {
  const appData = getAppData();
  // Ensure no duplicate profile for a user
  if (appData.doctorProfiles.find(p => p.userId === profile.userId)) {
    console.warn("Doctor profile already exists for this user.");
    return;
  }
  appData.doctorProfiles.push(profile);
  saveAppData(appData);
}

export function updateDoctorProfile(updatedProfile: DoctorProfile): void {
  const appData = getAppData();
  appData.doctorProfiles = appData.doctorProfiles.map(p => p.userId === updatedProfile.userId ? updatedProfile : p);
  saveAppData(appData);
}


// --- Patient Data Management ---
export function getPatientData(userId: string): PatientData | undefined {
  const { patientData } = getAppData();
  return patientData.find(data => data.userId === userId);
}

export function addPatientData(data: PatientData): void {
  const appData = getAppData();
   if (appData.patientData.find(p => p.userId === data.userId)) {
    console.warn("Patient data already exists for this user.");
    return;
  }
  appData.patientData.push(data);
  saveAppData(appData);
}

export function updatePatientData(updatedData: PatientData): void {
  const appData = getAppData();
  appData.patientData = appData.patientData.map(p => p.userId === updatedData.userId ? updatedData : p);
  saveAppData(appData);
}


// --- Appointment Management ---
export function getAppointments(filters?: { patientId?: string; doctorId?: string; status?: Appointment["status"] }): Appointment[] {
  let { appointments } = getAppData();
  if (filters?.patientId) {
    appointments = appointments.filter(app => app.patientId === filters.patientId);
  }
  if (filters?.doctorId) {
    appointments = appointments.filter(app => app.doctorId === filters.doctorId);
  }
  if (filters?.status) {
    appointments = appointments.filter(app => app.status === filters.status);
  }
  return appointments.map(appt => {
    const patient = findUserById(appt.patientId);
    const doctor = findUserById(appt.doctorId);
    const doctorProfile = getDoctorProfile(appt.doctorId);
    return {
      ...appt,
      patientName: patient?.name,
      doctorName: doctor?.name,
      doctorSpecialization: doctorProfile?.specialization
    };
  });
}

export function getAppointmentById(appointmentId: string): Appointment | undefined {
  const { appointments } = getAppData();
  const appointment = appointments.find(app => app.id === appointmentId);
  if (appointment) {
    const patient = findUserById(appointment.patientId);
    const doctor = findUserById(appointment.doctorId);
    const doctorProfile = getDoctorProfile(appointment.doctorId);
    return {
      ...appointment,
      patientName: patient?.name,
      doctorName: doctor?.name,
      doctorSpecialization: doctorProfile?.specialization
    };
  }
  return undefined;
}

export function addAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
  const appData = getAppData();
  const newAppointment: Appointment = { ...appointment, id: `appt-${Date.now()}-${Math.random().toString(16).slice(2)}` };
  appData.appointments.push(newAppointment);
  saveAppData(appData);
  return newAppointment;
}

export function updateAppointment(updatedAppointment: Appointment): void {
  const appData = getAppData();
  appData.appointments = appData.appointments.map(app => app.id === updatedAppointment.id ? updatedAppointment : app);
  saveAppData(appData);
}

export function cancelAppointment(appointmentId: string): void {
  const appData = getAppData();
  const appointment = appData.appointments.find(app => app.id === appointmentId);
  if (appointment) {
    appointment.status = "cancelled";
    saveAppData(appData);
  }
}

export function getDoctorsBySpecialization(specialization: string): DoctorProfile[] {
  const { doctorProfiles } = getAppData();
  return doctorProfiles.filter(profile => profile.specialization.toLowerCase() === specialization.toLowerCase());
}
