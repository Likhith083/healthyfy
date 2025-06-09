"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { CalendarDays, UserCog, ClipboardEdit, Stethoscope } from "lucide-react";
import Image from "next/image";
import { getPatientData, getDoctorProfile, findUserById, getAppointments } from "@/lib/dataService";
import type { DoctorProfile, User as DoctorUser, Appointment, AppointmentStatus } from "@/types";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const [assignedDoctor, setAssignedDoctor] = useState<{ profile: DoctorProfile; user: DoctorUser } | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      const patientData = getPatientData(user.id);
      if (patientData?.assignedDoctorId) {
        const doctorProfile = getDoctorProfile(patientData.assignedDoctorId);
        const doctorUser = findUserById(patientData.assignedDoctorId);
        if (doctorProfile && doctorUser) {
          setAssignedDoctor({ profile: doctorProfile, user: doctorUser as DoctorUser });
        }
      }
      const allAppointments = getAppointments({ patientId: user.id });
      const upcoming = allAppointments
        .filter(appt =>
          (appt.status === "confirmed" || appt.status === "pending" || appt.status === "rescheduled") &&
          new Date(appt.dateTime) >= new Date()
        )
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
        .slice(0, 3); 
      setUpcomingAppointments(upcoming);
    }
  }, [user]);

  if (!user) return null;

  const statusVariantMap: Record<AppointmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    confirmed: "default",
    cancelled: "destructive",
    completed: "secondary",
    rescheduled: "outline",
  };

  const hasAssignedDoctor = !!assignedDoctor;
  const hasUpcomingAppointments = upcomingAppointments.length > 0;

  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-12 px-8">
      <div className="w-full grid grid-cols-[260px_1fr] gap-8">
        {/* Left Column: Quick Actions */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href="/patient/symptoms"><ClipboardEdit className="h-5 w-5" /> Submit Symptoms</Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href="/patient/appointments"><CalendarDays className="h-5 w-5" /> My Appointments</Link>
              </Button>
              <Button asChild className="w-full justify-start gap-2" variant="outline">
                <Link href="/patient/profile"><UserCog className="h-5 w-5" /> My Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Right Column: Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Welcome, {user.name}!</CardTitle>
              <CardDescription>This is your personal health dashboard. Manage your appointments and health information.</CardDescription>
            </CardHeader>
          </Card>

          {hasAssignedDoctor && (
            <Card className="shadow-md flex flex-row items-center gap-8 p-6">
              <div className="flex-shrink-0">
                <Image
                  src={assignedDoctor.profile.profilePictureUrl || "https://placehold.co/120x120.png"}
                  alt={assignedDoctor.user.name}
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-primary object-cover"
                  data-ai-hint="doctor avatar"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Your Assigned Doctor</h3>
                <p className="text-lg font-bold">{assignedDoctor.user.name}</p>
                <p className="text-primary">{assignedDoctor.profile.specialization}</p>
                <p className="text-muted-foreground mt-1 text-sm">{assignedDoctor.profile.bio || "No bio provided."}</p>
                {assignedDoctor.profile.availability && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Availability:</strong> {assignedDoctor.profile.availability}
                  </p>
                )}
                <Button asChild className="mt-3" size="sm">
                  <Link href="/patient/profile">View Full Profile</Link>
                </Button>
              </div>
            </Card>
          )}

          {hasUpcomingAppointments && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map(appt => (
                  <div key={appt.id} className="p-3 border rounded-lg bg-secondary/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm">
                        {format(parseISO(appt.dateTime), "PPPPp")}
                      </p>
                      <p className="text-xs text-muted-foreground">With: {appt.doctorName} ({appt.doctorSpecialization})</p>
                      <p className="text-xs text-muted-foreground">Reason: {appt.reason || "General Checkup"}</p>
                      {appt.notes && <p className="text-xs text-muted-foreground mt-1"><strong>Doctor's Notes:</strong> {appt.notes}</p>}
                      {appt.prescription && <p className="text-xs text-muted-foreground mt-1"><strong>Prescription:</strong> {appt.prescription}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={statusVariantMap[appt.status] || 'default'} className="capitalize text-xs">
                        {appt.status}
                      </Badge>
                      <Button variant="link" size="sm" asChild className="p-0 h-auto mt-1 text-xs">
                        <Link href={`/patient/appointments?id=${appt.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" asChild className="mt-4 w-full md:w-auto" size="sm">
                  <Link href="/patient/appointments">View All Appointments</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {!hasAssignedDoctor && !hasUpcomingAppointments && (
            <Card className="shadow-md">
              <CardContent className="pt-6 text-center">
                <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  You currently have no assigned doctor or upcoming appointments.
                  <br />
                  <Link href="/patient/symptoms" className="text-primary hover:underline">Submit your symptoms</Link> to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
