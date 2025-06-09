"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAppointments, updateAppointment, findUserById } from "@/lib/dataService";
import type { Appointment } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarDays, CheckCircle, XCircle, Clock, RefreshCw, Edit, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import Link from "next/link";

const DoctorAppointmentCard: React.FC<{ 
    appointment: Appointment; 
    onConfirm: (appointmentId: string) => void; 
    onCancel: (appointmentId: string) => void;
    onAddNotes: (appointmentId: string, notes: string) => void;
}> = ({ appointment, onConfirm, onCancel, onAddNotes }) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || "");
  const patient = findUserById(appointment.patientId);

  const handleSaveNotes = () => {
    onAddNotes(appointment.id, notes);
    setShowNotesModal(false);
  };

  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
    cancelled: <XCircle className="h-5 w-5 text-red-500" />,
    completed: <CheckCircle className="h-5 w-5 text-blue-500" />,
    rescheduled: <RefreshCw className="h-5 w-5 text-orange-500" />,
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-headline">
              {format(parseISO(appointment.dateTime), "PP")}
            </CardTitle>
            <CardDescription>
              {format(parseISO(appointment.dateTime), "p")} with {patient?.name || 'Patient'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 p-1 bg-muted rounded-md">
            {statusIcons[appointment.status]}
            <span className="text-xs font-medium capitalize">{appointment.status}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1"><strong>Reason:</strong> {appointment.reason || "General Checkup"}</p>
        {appointment.notes && <p className="text-sm text-muted-foreground"><strong>Notes:</strong> {appointment.notes}</p>}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 flex-wrap">
        {appointment.status === "pending" && (
          <Button variant="default" size="sm" onClick={() => onConfirm(appointment.id)}><CheckCircle className="mr-2 h-4 w-4"/>Confirm</Button>
        )}
        {(appointment.status === "confirmed" || appointment.status === "pending") && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm"><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Cancel Appointment?</AlertDialogTitle><AlertDialogDescription>This will cancel the appointment with {patient?.name}.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Keep</AlertDialogCancel><AlertDialogAction onClick={() => onCancel(appointment.id)}>Confirm Cancel</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {(appointment.status === "confirmed" || appointment.status === "completed") && (
          <AlertDialog open={showNotesModal} onOpenChange={setShowNotesModal}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4"/>{appointment.notes ? 'Edit Notes' : 'Add Notes'}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Diagnostic Notes</AlertDialogTitle><AlertDialogDescription>Add or update notes for {patient?.name}'s appointment on {format(parseISO(appointment.dateTime), "PP")}.</AlertDialogDescription></AlertDialogHeader>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Enter diagnostic notes, treatment plan, etc."/>
              <AlertDialogFooter><AlertDialogCancel>Close</AlertDialogCancel><AlertDialogAction onClick={handleSaveNotes}>Save Notes</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
         <Button variant="link" size="sm" asChild><Link href={`/doctor/patients/${appointment.patientId}`}>View Patient</Link></Button>
      </CardFooter>
    </Card>
  );
};


export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = useCallback(() => {
    if (user && user.role === 'doctor') {
      setIsLoading(true);
      const doctorAppointments = getAppointments({ doctorId: user.id });
      setAppointments(doctorAppointments.sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  const handleStatusUpdate = (appointmentId: string, status: Appointment["status"], notes?: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      const updatedData: Partial<Appointment> = { status };
      if (notes !== undefined) updatedData.notes = notes;
      updateAppointment({ ...appointment, ...updatedData });
      toast({ title: "Success", description: `Appointment ${status}.` });
      fetchAppointments();
    }
  };


  if (isLoading) return <div className="text-center p-8">Loading appointments...</div>;

  const upcomingAppointments = appointments.filter(app => (app.status === "confirmed" || app.status === "pending" || app.status === "rescheduled") && new Date(app.dateTime) >= new Date());
  const pastAppointments = appointments.filter(app => app.status === "completed" || app.status === "cancelled" || new Date(app.dateTime) < new Date());

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center"><CalendarDays className="mr-3 h-8 w-8 text-primary" />My Appointments</CardTitle>
          <CardDescription>Manage your patient appointments.</CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="upcoming">Upcoming & Pending</TabsTrigger>
          <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {upcomingAppointments.map(app => (
                <DoctorAppointmentCard 
                    key={app.id} 
                    appointment={app} 
                    onConfirm={(id) => handleStatusUpdate(id, "confirmed")}
                    onCancel={(id) => handleStatusUpdate(id, "cancelled")}
                    onAddNotes={(id, newNotes) => handleStatusUpdate(id, app.status, newNotes)} // status doesn't change here
                />
              ))}
            </div>
          ) : <p className="text-center text-muted-foreground mt-8">No upcoming or pending appointments.</p>}
        </TabsContent>
        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {pastAppointments.map(app => (
                 <DoctorAppointmentCard 
                    key={app.id} 
                    appointment={app} 
                    onConfirm={(id) => {}} // Should not happen for past
                    onCancel={(id) => {}} // Should not happen for past
                    onAddNotes={(id, newNotes) => handleStatusUpdate(id, app.status, newNotes)}
                />
              ))}
            </div>
          ) : <p className="text-center text-muted-foreground mt-8">No past or cancelled appointments.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
