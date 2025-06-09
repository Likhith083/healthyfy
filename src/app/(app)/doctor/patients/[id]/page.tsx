"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { findUserById, getPatientData, getAppointments, updateAppointment, addAppointment } from "@/lib/dataService";
import type { User, PatientData, Appointment, DoctorProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, UserCircle, Mail, Phone, CalendarPlus, FileText, Edit3 } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";


export default function DoctorPatientDetailPage({ params }: { params: { id: string } }) {
  const { user: doctorUser } = useAuth();
  const [patient, setPatient] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [prescriptionContent, setPrescriptionContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      const fetchedPatient = findUserById(params.id);
      if (fetchedPatient && fetchedPatient.role === 'patient') {
        setPatient(fetchedPatient);
        setPatientData(getPatientData(params.id) || null);
        if (doctorUser) {
          setAppointments(getAppointments({ patientId: params.id, doctorId: doctorUser.id }).sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
        }
      }
    }
  }, [params.id, doctorUser]);
  
  const getInitials = (name?: string) => {
    if (!name) return "P";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleSaveNote = () => {
    if (editingAppointment && doctorUser) {
      const updatedAppt = {
        ...editingAppointment,
        notes: noteContent,
        prescription: prescriptionContent,
      };
      updateAppointment(updatedAppt);
      setAppointments(getAppointments({ patientId: params.id, doctorId: doctorUser.id }).sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
      setEditingAppointment(null);
      setNoteContent("");
      setPrescriptionContent("");
      toast({title: "Note & Prescription Saved", description: "Diagnostic note and prescription have been updated."});
    }
  };

  if (!patient) return <div className="text-center p-8">Patient not found or you do not have access.</div>;

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/doctor/patients"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients</Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={`https://placehold.co/80x80.png?text=${getInitials(patient.name)}`} alt={patient.name} data-ai-hint="avatar person"/>
            <AvatarFallback className="text-3xl">{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-3xl">{patient.name}</CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center"><Mail className="mr-1 h-4 w-4" />{patient.email}</span>
              {/* <span className="flex items-center"><Phone className="mr-1 h-4 w-4" />{patientData?.contactInfo?.phone || "N/A"}</span> */}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            {/* Basic patient info, DOB, address could go here if available */}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Symptom History</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {patientData?.symptomsLog && patientData.symptomsLog.length > 0 ? (
              <ul className="space-y-3">
                {patientData.symptomsLog.map(log => (
                  <li key={log.id} className="p-3 border rounded-md bg-secondary/30">
                    <p className="font-medium text-sm">{new Date(log.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs text-muted-foreground">{log.symptoms}</p>
                    {log.matchedSpecialist && <p className="text-xs text-primary">AI Matched: {log.matchedSpecialist}</p>}
                  </li>
                )).reverse()} {/* Show most recent first */}
              </ul>
            ) : <p className="text-muted-foreground">No symptom history recorded.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="font-headline text-xl">Appointments</CardTitle>
            <Button size="sm" variant="outline" disabled>
              <CalendarPlus className="mr-2 h-4 w-4" /> New (From Patient Portal)
            </Button>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {appointments.length > 0 ? (
              <ul className="space-y-3">
                {appointments.map(appt => (
                  <li key={appt.id} className="p-3 border rounded-md bg-secondary/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-sm">{format(parseISO(appt.dateTime), "PPp")}</p>
                            <p className="text-xs text-muted-foreground capitalize">Status: <span className={`font-semibold ${appt.status === 'confirmed' ? 'text-green-600' : appt.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{appt.status}</span></p>
                        </div>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => {setEditingAppointment(appt); setNoteContent(appt.notes || ""); setPrescriptionContent(appt.prescription || "");}}>
                                <Edit3 className="h-4 w-4"/>
                            </Button>
                        </DialogTrigger>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Reason: {appt.reason || "N/A"}</p>
                    {appt.notes && <p className="text-xs text-muted-foreground mt-1"><strong>Notes:</strong> {appt.notes}</p>}
                    {appt.prescription && <p className="text-xs text-muted-foreground mt-1"><strong>Prescription:</strong> {appt.prescription}</p>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted-foreground">No appointments with you for this patient.</p>}
          </CardContent>
        </Card>
      </div>
        
      <Dialog open={!!editingAppointment} onOpenChange={(isOpen) => { if (!isOpen) { setEditingAppointment(null); setPrescriptionContent(""); } }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Manage Appointment Note</DialogTitle>
                <DialogDescription>
                    For appointment on {editingAppointment && format(parseISO(editingAppointment.dateTime), "PPp")}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div>
                    <Label htmlFor="notes" className="font-medium">Diagnostic Notes / Treatment Plan</Label>
                    <Textarea id="notes" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} rows={4} className="mt-1"/>
                </div>
                <div>
                    <Label htmlFor="prescription" className="font-medium">Prescription / Medication Instructions</Label>
                    <Textarea id="prescription" value={prescriptionContent} onChange={(e) => setPrescriptionContent(e.target.value)} rows={3} className="mt-1"/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleSaveNote}>Save Note</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

