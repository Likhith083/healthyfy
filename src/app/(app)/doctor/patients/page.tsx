"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAppointments, findUserById, getPatientData, getUsers } from "@/lib/dataService";
import type { User, PatientData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Eye } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorPatientView extends User {
  lastAppointment?: string;
  totalAppointments?: number;
  symptomsSummary?: string;
}

export default function DoctorManagePatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<DoctorPatientView[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (user && user.role === 'doctor') {
      // Get all patients assigned to this doctor
      const assignedPatients = getUsers('patient').filter(p => {
        const pdata = getPatientData(p.id);
        return pdata && pdata.assignedDoctorId === user.id;
      });
      console.log('Assigned patients for doctor', user.id, assignedPatients);
      // Map for quick lookup
      const patientMap = new Map<string, DoctorPatientView>();
      assignedPatients.forEach(patientUser => {
        const patientProfileData = getPatientData(patientUser.id);
        patientMap.set(patientUser.id, {
          ...patientUser,
          totalAppointments: 0,
          symptomsSummary: patientProfileData?.symptomsLog.slice(-1)[0]?.symptoms.substring(0, 50) + "..." || "No recent symptoms"
        });
      });
      // Add appointment info
      const doctorAppointments = getAppointments({ doctorId: user.id });
      doctorAppointments.forEach(appt => {
        const existingPatient = patientMap.get(appt.patientId);
        if (existingPatient) {
          existingPatient.totalAppointments!++;
          if (!existingPatient.lastAppointment || new Date(appt.dateTime) > new Date(existingPatient.lastAppointment)) {
            existingPatient.lastAppointment = appt.dateTime;
          }
        }
      });
      const finalPatients = Array.from(patientMap.values());
      console.log('Final patient list for doctor', user.id, finalPatients);
      setPatients(finalPatients);
    }
  }, [user]);
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(filter.toLowerCase()) || 
      p.email.toLowerCase().includes(filter.toLowerCase())
    );
  }, [patients, filter]);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center"><Users className="mr-3 h-8 w-8 text-primary" />My Patients</CardTitle>
          <CardDescription>View and manage your assigned patients.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter patients by name or email..."
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Appointment</TableHead>
                  <TableHead>Total Appts</TableHead>
                  <TableHead>Recent Symptoms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                             <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(patient.name)}`} alt={patient.name} data-ai-hint="avatar person" />
                             <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                           </Avatar>
                           {patient.name}
                        </div>
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{patient.totalAppointments || 0}</TableCell>
                      <TableCell className="max-w-xs truncate">{patient.symptomsSummary}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/doctor/patients/${patient.id}`}><Eye className="mr-1 h-4 w-4" /> View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">No patients found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
