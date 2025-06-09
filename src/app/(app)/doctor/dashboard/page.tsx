"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAppointments, getUsers } from "@/lib/dataService";
import type { Appointment, User as PatientUser } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Users, ListChecks, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [assignedPatientsCount, setAssignedPatientsCount] = useState(0);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);

  useEffect(() => {
    if (user && user.role === 'doctor') {
      const appointments = getAppointments({ doctorId: user.id });
      const upcoming = appointments
        .filter(app => (app.status === "confirmed" || app.status === "pending") && new Date(app.dateTime) >= new Date())
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
        .slice(0, 5); // Show up to 5 upcoming
      setUpcomingAppointments(upcoming);

      const pending = appointments.filter(app => app.status === "pending").length;
      setPendingAppointmentsCount(pending);
      
      // For assigned patients count, we need to check appointments or a direct link if data model supports it.
      // Simple way: count unique patient IDs from all appointments.
      const patientIds = new Set(appointments.map(app => app.patientId));
      setAssignedPatientsCount(patientIds.size);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Welcome, Dr. {user.name}!</CardTitle>
          <CardDescription>Your dashboard for managing patients and appointments.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned Patients</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedPatientsCount}</div>
            <Button asChild variant="link" className="px-0 pt-2 text-xs text-muted-foreground">
              <Link href="/doctor/patients">View All Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointmentsCount}</div>
             <Button asChild variant="link" className="px-0 pt-2 text-xs text-muted-foreground">
              <Link href="/doctor/appointments?status=pending">Review Pending</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage All Appointments</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">View your schedule, confirm, or reschedule appointments.</p>
            <Button asChild className="w-full">
              <Link href="/doctor/appointments">Go to Appointments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {upcomingAppointments.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map(appt => (
              <div key={appt.id} className="p-4 border rounded-lg bg-secondary/30 flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {new Date(appt.dateTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    {' at '}
                    {new Date(appt.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-muted-foreground">Patient: {appt.patientName || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Reason: {appt.reason || "Not specified"}</p>
                </div>
                <Badge variant={appt.status === 'pending' ? 'destructive' : 'default'} className="capitalize">{appt.status}</Badge>
              </div>
            ))}
            <Button variant="outline" asChild className="mt-4">
              <Link href="/doctor/appointments">View Full Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      )}
       {upcomingAppointments.length === 0 && pendingAppointmentsCount === 0 && (
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You have no upcoming or pending appointments at the moment.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
