"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getPatientData, getDoctorProfile, findUserById } from '@/lib/dataService';
import type { User, DoctorProfile, PatientData, UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCog, Stethoscope, Edit3, Mail, Phone, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { getAppointments } from '@/lib/dataService';

export default function PatientProfilePage() {
  const { user, logout } = useAuth();
  const [patientDetails, setPatientDetails] = useState<PatientData | null>(null);
  const [assignedDoctor, setAssignedDoctor] = useState<{ profile: DoctorProfile; user: User } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const pData = getPatientData(user.id);
      if (pData) {
        setPatientDetails(pData);
        if (pData.assignedDoctorId) {
          const docProfile = getDoctorProfile(pData.assignedDoctorId);
          const docUser = findUserById(pData.assignedDoctorId);
          if (docProfile && docUser) {
            setAssignedDoctor({ profile: docProfile, user: docUser });
          }
        }
      }
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">Please log in to view your profile.</div>;
  }
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <UserCog className="mr-3 h-8 w-8 text-primary" />My Profile
          </CardTitle>
          <CardDescription>Your personal and health information.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-12 w-full">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name} data-ai-hint="profile avatar" />
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {/* Add more patient-specific details if needed */}
            {/* For example: DOB, Address, etc. Could be an "Edit Profile" feature */}
            <Button variant="outline">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Not Implemented)
            </Button>
          </div>
          
          {assignedDoctor ? (
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center">
                  <Stethoscope className="mr-2 h-6 w-6 text-primary" /> Assigned Doctor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="flex items-center space-x-4">
                    <Image
                        src={assignedDoctor.profile.profilePictureUrl || "https://placehold.co/80x80.png"}
                        alt={assignedDoctor.user.name}
                        width={80}
                        height={80}
                        className="rounded-full border"
                        data-ai-hint="doctor avatar"
                    />
                    <div>
                        <h4 className="text-lg font-semibold">{assignedDoctor.user.name}</h4>
                        <p className="text-primary">{assignedDoctor.profile.specialization}</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{assignedDoctor.profile.bio}</p>
                <div className="text-sm space-y-1">
                  <p className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {assignedDoctor.user.email}</p>
                  {/* Add phone if available */}
                  {assignedDoctor.profile.availability && (
                    <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Availability:</strong> {assignedDoctor.profile.availability}</p>
                  )}
                </div>
                <Button asChild size="sm" className="mt-2">
                  <Link href={`/patient/appointments`}>Book/Manage Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-secondary/30 flex flex-col items-center justify-center p-6 text-center">
               <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl font-headline">No Doctor Assigned</CardTitle>
              <CardDescription className="mt-2">
                You haven't been assigned a doctor yet. Please submit your symptoms so we can match you with a specialist.
              </CardDescription>
              <Button asChild className="mt-4">
                <Link href="/patient/symptoms">Submit Symptoms</Link>
              </Button>
            </Card>
          )}
        </CardContent>
      </Card>

      {patientDetails && patientDetails.symptomsLog.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Symptom History</CardTitle>
            <CardDescription>Your recorded symptom entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {patientDetails.symptomsLog.slice(0, 5).map(log => ( // Show latest 5
                <li key={log.id} className="p-3 border rounded-md bg-muted/20">
                  <p className="font-medium">
                    {new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">Symptoms: {log.symptoms}</p>
                  {log.matchedSpecialist && <p className="text-xs text-primary">Matched: {log.matchedSpecialist}</p>}
                </li>
              ))}
            </ul>
            {patientDetails.symptomsLog.length > 5 && (
                <Button variant="link" asChild className="mt-2">
                    <Link href="/patient/symptoms/history">View All Symptom History (Not Implemented)</Link>
                </Button>
            )}
          </CardContent>
        </Card>
      )}

      {user && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Appointment History</CardTitle>
            <CardDescription>Your past appointments, doctor notes, and prescriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {getAppointments({ patientId: user.id }).length === 0 ? (
              <p className="text-muted-foreground">No appointments found.</p>
            ) : (
              <ul className="space-y-3">
                {getAppointments({ patientId: user.id })
                  .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                  .map(appt => (
                    <li key={appt.id} className="p-3 border rounded-md bg-muted/20">
                      <p className="font-medium">
                        {format(parseISO(appt.dateTime), "PPPPp")}
                      </p>
                      <p className="text-xs text-muted-foreground">Doctor: {appt.doctorName} ({appt.doctorSpecialization})</p>
                      <p className="text-xs text-muted-foreground">Reason: {appt.reason || "General Checkup"}</p>
                      {appt.notes && <p className="text-xs text-muted-foreground mt-1"><strong>Doctor's Notes:</strong> {appt.notes}</p>}
                      {appt.prescription && <p className="text-xs text-muted-foreground mt-1"><strong>Prescription:</strong> {appt.prescription}</p>}
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Logout Button */}
      <div className="flex justify-center mt-8">
        <Button variant="destructive" onClick={logout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
