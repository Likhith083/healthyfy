"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAppointments, getUsers } from "@/lib/dataService";
import type { Appointment, User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Stethoscope, CalendarCheck2, Settings, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  // const [systemLogsCount, setSystemLogsCount] = useState(0); // For optional feature

  useEffect(() => {
    if (user && user.role === 'admin') {
      setTotalPatients(getUsers('patient').length);
      setTotalDoctors(getUsers('doctor').length);
      setTotalAppointments(getAppointments().length);
      // Fetch system logs count if implementing that feature
    }
  }, [user]);

  if (!user) return null; // Or a loading/auth check component

  return (
    <div className="space-y-6">
      {/* Logout Button */}
      <div className="flex justify-end">
        <Button variant="destructive" onClick={logout} className="mb-2">Log Out</Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Administrator Dashboard</CardTitle>
          <CardDescription>Oversee and manage the HealthMatch Direct platform.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Patients</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <Button asChild variant="link" className="px-0 pt-2 text-xs text-muted-foreground">
              <Link href="/admin/patients">Manage Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Doctors</CardTitle>
            <Stethoscope className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDoctors}</div>
            <Button asChild variant="link" className="px-0 pt-2 text-xs text-muted-foreground">
              <Link href="/admin/doctors">Manage Doctors</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
             <Button asChild variant="link" className="px-0 pt-2 text-xs text-muted-foreground">
              <Link href="/admin/appointments">Manage Appointments</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Settings</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground mb-2">Configure platform settings and parameters.</p>
            <Button asChild className="w-full">
              <Link href="/admin/settings">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
         <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary"/> System Analytics (Placeholder)
            </CardTitle>
            <CardDescription>Overview of system activity and performance metrics.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <p>Analytics dashboard coming soon.</p>
            {/* Placeholder for charts or key metrics */}
            <div className="w-full mt-4">
                 <img src="https://placehold.co/800x200.png?text=Analytics+Chart+Placeholder" alt="Analytics Chart Placeholder" className="w-full rounded-md" data-ai-hint="data chart"/>
            </div>
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" asChild><Link href="/admin/doctors/add">Add New Doctor</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/patients/reassign">Reassign Patient</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/appointments/new">Schedule Manual Appointment</Link></Button>
          <Button variant="outline" asChild><Link href="/admin/logs">View System Logs (N/I)</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
