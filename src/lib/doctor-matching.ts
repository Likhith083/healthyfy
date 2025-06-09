import { GoogleGenerativeAI } from '@google/generative-ai';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  availability: {
    days: string[];
    hours: string[];
  };
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  insurance: string[];
  languages: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
}

interface Patient {
  id: string;
  symptoms: string[];
  medicalHistory: string[];
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  insurance: string;
  preferredLanguage: string;
  previousDoctors?: string[];
}

interface MatchResult {
  doctor: Doctor;
  matchScore: number;
  reasons: string[];
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function matchDoctor(patient: Patient, doctors: Doctor[]): Promise<MatchResult[]> {
  try {
    // 1. Initial filtering based on basic criteria
    let filteredDoctors = doctors.filter(doctor => {
      // Check insurance compatibility
      const insuranceMatch = doctor.insurance.includes(patient.insurance);
      
      // Check language preference
      const languageMatch = doctor.languages.includes(patient.preferredLanguage);
      
      // Check if doctor was previously seen
      const notPreviousDoctor = !patient.previousDoctors?.includes(doctor.id);
      
      return insuranceMatch && languageMatch && notPreviousDoctor;
    });

    // 2. Use AI to analyze symptoms and match with specialties
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Analyze the following patient symptoms and medical history to determine the most appropriate medical specialties:
      
      Symptoms: ${patient.symptoms.join(', ')}
      Medical History: ${patient.medicalHistory.join(', ')}
      
      Please provide:
      1. A list of relevant medical specialties in order of priority
      2. A brief explanation for each specialty recommendation
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiAnalysis = response.text();

    // 3. Score doctors based on multiple factors
    const scoredDoctors = filteredDoctors.map(doctor => {
      let score = 0;
      const reasons: string[] = [];

      // Specialty match score (0-40 points)
      const specialtyScore = calculateSpecialtyScore(doctor.specialty, aiAnalysis);
      score += specialtyScore;
      if (specialtyScore > 0) {
        reasons.push(`Specialty match: ${specialtyScore} points`);
      }

      // Experience score (0-20 points)
      const experienceScore = Math.min(doctor.experience * 2, 20);
      score += experienceScore;
      reasons.push(`Experience: ${experienceScore} points`);

      // Rating score (0-20 points)
      const ratingScore = doctor.rating * 4;
      score += ratingScore;
      reasons.push(`Rating: ${ratingScore} points`);

      // Location score (0-20 points)
      const locationScore = calculateLocationScore(doctor.location, patient.location);
      score += locationScore;
      if (locationScore > 0) {
        reasons.push(`Location convenience: ${locationScore} points`);
      }

      return {
        doctor,
        matchScore: score,
        reasons,
      };
    });

    // 4. Sort by match score and return top matches
    return scoredDoctors
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  } catch (error) {
    console.error('Error in doctor matching:', error);
    throw new Error('Failed to match doctors');
  }
}

function calculateSpecialtyScore(specialty: string, aiAnalysis: string): number {
  // This is a simplified version. In a real implementation, you would:
  // 1. Parse the AI analysis to extract recommended specialties
  // 2. Compare the doctor's specialty with the recommended specialties
  // 3. Assign points based on the match quality
  
  const specialties = aiAnalysis.toLowerCase();
  if (specialties.includes(specialty.toLowerCase())) {
    return 40;
  }
  return 0;
}

function calculateLocationScore(doctorLocation: Doctor['location'], patientLocation: Patient['location']): number {
  // Calculate distance between doctor and patient
  const distance = calculateDistance(
    doctorLocation.coordinates.lat,
    doctorLocation.coordinates.lng,
    patientLocation.coordinates.lat,
    patientLocation.coordinates.lng
  );

  // Score based on distance (in kilometers)
  if (distance <= 5) return 20;
  if (distance <= 10) return 15;
  if (distance <= 20) return 10;
  if (distance <= 30) return 5;
  return 0;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
} 