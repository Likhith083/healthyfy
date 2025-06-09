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
  { id: "doc004", email: "alan@healthmatch.direct", password: "password123", name: "Dr. Alan Smith", role: "doctor" },

];

const initialPatients: User[] = [
  { id: "pat001", email: "patient@healthmatch.direct", password: "password123", name: "Sarah Johnson", role: "patient" },
  { id: "pat002", email: "james@healthmatch.direct", password: "password123", name: "James Carter", role: "patient" },
  { id: "pat003", email: "linda@healthmatch.direct", password: "password123", name: "Linda Martinez", role: "patient" },
];

const initialDoctorProfiles: DoctorProfile[] = [
  { userId: "doc001", specialization: "Cardiologist", bio: "Expert in heart-related issues.", profilePictureUrl: "https://placehold.co/100x100.png", availability: "Mon, Wed, Fri 9am-5pm" },
  { userId: "doc002", specialization: "Dermatologist", bio: "Specializes in skin conditions.", profilePictureUrl: "https://placehold.co/100x100.png", availability: "Tue, Thu 10am-6pm" },
  { userId: "doc003", specialization: "General Physician", bio: "Provides general medical care.", profilePictureUrl: "https://placehold.co/100x100.png", availability: "Mon-Fri 8am-4pm" },
];

const initialPatientData: PatientData[] = [
  {
    userId: "pat001",
    symptomsLog: [
      {
        id: "sym001",
        date: "2024-03-15T10:00:00Z",
        symptoms: "Chest pain, shortness of breath, elevated blood pressure",
        matchedSpecialist: "Cardiologist"
      },
      {
        id: "sym002",
        date: "2024-03-20T14:30:00Z",
        symptoms: "Acute chest pain, dizziness",
        matchedSpecialist: "Cardiologist"
      }
    ],
    assignedDoctorId: "doc001"
  },
  {
    userId: "pat002",
    symptomsLog: [
      {
        id: "sym003",
        date: "2024-03-18T09:00:00Z",
        symptoms: "Palpitations, mild chest discomfort",
        matchedSpecialist: "Cardiologist"
      }
    ],
    assignedDoctorId: "doc001"
  },
  {
    userId: "pat003",
    symptomsLog: [
      {
        id: "sym004",
        date: "2024-03-22T11:30:00Z",
        symptoms: "Shortness of breath during exercise",
        matchedSpecialist: "Cardiologist"
      }
    ],
    assignedDoctorId: "doc001"
  }
];

const initialAppointments: Appointment[] = [
  // Sarah Johnson
  {
    id: "appt001",
    patientId: "pat001",
    doctorId: "doc001",
    dateTime: "2024-03-15T10:00:00Z",
    status: "completed",
    reason: "Initial consultation for heart condition",
    notes: "Patient presents with symptoms of hypertension. ECG shows normal rhythm. Prescribed beta blockers.",
    prescription: "Beta blockers - 25mg daily"
  },
  {
    id: "appt002",
    patientId: "pat001",
    doctorId: "doc001",
    dateTime: "2024-03-20T14:30:00Z",
    status: "completed",
    reason: "Emergency visit for chest pain",
    notes: "Patient reported acute chest pain. ECG shows slight abnormality. Adjusted medication dosage.",
    prescription: "Beta blockers - 50mg daily"
  },
  {
    id: "appt003",
    patientId: "pat001",
    doctorId: "doc001",
    dateTime: "2024-04-01T11:00:00Z",
    status: "confirmed",
    reason: "Follow-up appointment for medication effectiveness check"
  },
  // James Carter
  {
    id: "appt004",
    patientId: "pat002",
    doctorId: "doc001",
    dateTime: "2024-03-19T10:30:00Z",
    status: "completed",
    reason: "Consultation for palpitations",
    notes: "Patient describes palpitations and mild discomfort. Recommended Holter monitor.",
    prescription: "Holter monitor for 24 hours"
  },
  {
    id: "appt005",
    patientId: "pat002",
    doctorId: "doc001",
    dateTime: "2024-03-26T09:00:00Z",
    status: "confirmed",
    reason: "Follow-up for Holter results"
  },
  // Linda Martinez
  {
    id: "appt006",
    patientId: "pat003",
    doctorId: "doc001",
    dateTime: "2024-03-23T13:00:00Z",
    status: "completed",
    reason: "Shortness of breath during exercise",
    notes: "Patient reports shortness of breath. Scheduled stress test.",
    prescription: "Stress test scheduled"
  },
  {
    id: "appt007",
    patientId: "pat003",
    doctorId: "doc001",
    dateTime: "2024-03-30T10:00:00Z",
    status: "confirmed",
    reason: "Review stress test results"
  }
];

// Example doctor-patient messages (for demo, not used in UI yet)
export const exampleMessages = [
  {
    from: "doc001",
    to: "pat001",
    date: "2024-03-15T12:00:00Z",
    message: "Sarah, please monitor your blood pressure daily and update me if you notice any changes."
  },
  {
    from: "pat001",
    to: "doc001",
    date: "2024-03-16T08:00:00Z",
    message: "Thank you, doctor. I will keep you posted."
  },
  {
    from: "doc001",
    to: "pat002",
    date: "2024-03-19T12:00:00Z",
    message: "James, your Holter monitor results will be ready in a few days. Please let me know if you have any symptoms."
  },
  {
    from: "pat002",
    to: "doc001",
    date: "2024-03-20T09:00:00Z",
    message: "Will do, thank you."
  },
  {
    from: "doc001",
    to: "pat003",
    date: "2024-03-23T15:00:00Z",
    message: "Linda, your stress test is scheduled for next week. Please avoid caffeine before the test."
  },
  {
    from: "pat003",
    to: "doc001",
    date: "2024-03-24T10:00:00Z",
    message: "Thank you for the instructions, doctor."
  }
];

const defaultAppData: AppData = {
  users: [initialAdminUser, ...initialDoctors, ...initialPatients],
  doctorProfiles: initialDoctorProfiles,
  patientData: initialPatientData,
  appointments: initialAppointments,
};

export function getAppData(): AppData {
  return getLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);
}

export function saveAppData(data: AppData): void {
  setLocalStorageItem<AppData>(APP_DATA_KEY, data);
}

export function resetAppData(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(APP_DATA_KEY);
    saveAppData(defaultAppData);
  }
}

// Initialize data if it doesn't exist
const initializeData = () => {
  const existingData = getLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);
  console.log('Existing data:', existingData);
  
  if (!existingData) {
    console.log('Initializing new data');
    setLocalStorageItem(APP_DATA_KEY, defaultAppData);
  }
};

// Call initialization
initializeData();

// --- User Management ---
export const findUserByEmail = (email: string): User | undefined => {
  const appData = getLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);
  console.log('Current app data:', appData);
  return appData?.users.find(user => user.email === email);
};

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

// Utility: Add sample patient user if missing
export function addSamplePatientUser() {
  const appData = getLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);
  const patientExists = appData.users.some(u => u.email === "patient@healthmatch.direct");
  if (!patientExists) {
    appData.users.push({
      id: "pat001",
      email: "patient@healthmatch.direct",
      password: "patient123",
      name: "Sarah Johnson",
      role: "patient"
    });
    setLocalStorageItem<AppData>(APP_DATA_KEY, appData);
    console.log("Sample patient user added.");
  } else {
    console.log("Sample patient user already exists.");
  }
}

// Utility: Restore all demo data (users, patients, appointments, etc.)
export function restoreDemoData() {
  setLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);
  console.log("Demo data restored. Please refresh the page.");
}

// Ensure all hardcoded users, patientData, and appointments are present in localStorage
function ensureSeedUsersPresent() {
  const appData = getLocalStorageItem<AppData>(APP_DATA_KEY, defaultAppData);

  // Merge users
  const existingEmails = new Set(appData.users.map(u => u.email));
  const seedUsers = [initialAdminUser, ...initialDoctors, ...initialPatients];
  seedUsers.forEach(user => {
    if (!existingEmails.has(user.email)) {
      appData.users.push(user);
    }
  });

  // Merge patientData
  const existingPatientIds = new Set(appData.patientData.map(p => p.userId));
  initialPatientData.forEach(pd => {
    if (!existingPatientIds.has(pd.userId)) {
      appData.patientData.push(pd);
    }
  });

  // Merge appointments
  const existingAppointmentIds = new Set(appData.appointments.map(a => a.id));
  initialAppointments.forEach(appt => {
    if (!existingAppointmentIds.has(appt.id)) {
      appData.appointments.push(appt);
    }
  });

  setLocalStorageItem<AppData>(APP_DATA_KEY, appData);
}

// Call ensureSeedUsersPresent on every app load
ensureSeedUsersPresent();
