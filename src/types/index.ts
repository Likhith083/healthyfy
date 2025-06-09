export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string; // Password will not be stored directly in client-side state after login
  name: string;
  role: UserRole;
}

export interface DoctorProfile {
  userId: string;
  specialization: string;
  availability?: string; // e.g., "Mon-Fri 9am-5pm"
  bio?: string;
  profilePictureUrl?: string;
}

export interface PatientData {
  userId: string;
  symptomsLog: SymptomEntry[];
  assignedDoctorId?: string;
}

export interface SymptomEntry {
  id: string;
  date: string; // ISO date string
  symptoms: string;
  matchedSpecialist?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // Denormalized for easier display
  doctorId: string;
  doctorName?: string; // Denormalized
  doctorSpecialization?: string; // Denormalized
  dateTime: string; // ISO date string
  status: AppointmentStatus;
  reason?: string; // Symptoms or reason for visit
  notes?: string; // Doctor's notes
  prescription?: string; // Link or text
}

// For localStorage structure
export interface AppData {
  users: User[];
  doctorProfiles: DoctorProfile[];
  patientData: PatientData[];
  appointments: Appointment[];
}
