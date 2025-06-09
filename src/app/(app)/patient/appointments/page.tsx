"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAppointments, updateAppointment, cancelAppointment as cancelAppointmentApi, findUserById, getDoctorProfile } from "@/lib/dataService";
import type { Appointment, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarDays, CheckCircle, XCircle, Clock, RefreshCw, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const AppointmentCard: React.FC<{ appointment: Appointment; onReschedule: (appointmentId: string, newDateTime: string) => void; onCancel: (appointmentId: string) => void }> = ({ appointment, onReschedule, onCancel }) => {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(new Date(appointment.dateTime));
  const [newTime, setNewTime] = useState<string>(format(new Date(appointment.dateTime), "HH:mm"));

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]; // Example times

  const handleReschedule = () => {
    if (newDate) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const combinedDateTime = new Date(newDate);
      combinedDateTime.setHours(hours, minutes);
      onReschedule(appointment.id, combinedDateTime.toISOString());
      setShowRescheduleModal(false);
    }
  };
  
  const doctor = findUserById(appointment.doctorId);
  const doctorProfile = getDoctorProfile(appointment.doctorId);

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
              {new Date(appointment.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </CardTitle>
            <CardDescription>
              {new Date(appointment.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} with {doctor?.name || 'Doctor'} ({doctorProfile?.specialization || 'Specialist'})
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
      {(appointment.status === "confirmed" || appointment.status === "pending") && (
        <CardFooter className="flex justify-end gap-2">
           <AlertDialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />Reschedule</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reschedule Appointment</AlertDialogTitle>
                <AlertDialogDescription>
                  Select a new date and time for your appointment with {doctor?.name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={newTime} onValueChange={setNewTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReschedule}>Confirm Reschedule</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will cancel your appointment. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                <AlertDialogAction onClick={() => onCancel(appointment.id)}>Confirm Cancellation</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = useCallback(() => {
    if (user) {
      setIsLoading(true);
      const userAppointments = getAppointments({ patientId: user.id });
      setAppointments(userAppointments.sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleReschedule = (appointmentId: string, newDateTime: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      updateAppointment({ ...appointment, dateTime: newDateTime, status: "rescheduled" });
      toast({ title: "Success", description: "Appointment rescheduled." });
      fetchAppointments();
    }
  };

  const handleCancel = (appointmentId: string) => {
    cancelAppointmentApi(appointmentId);
    toast({ title: "Success", description: "Appointment cancelled." });
    fetchAppointments();
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading appointments...</div>;
  }

  const upcomingAppointments = appointments.filter(app => (app.status === "confirmed" || app.status === "pending" || app.status === "rescheduled") && new Date(app.dateTime) >= new Date());
  const pastAppointments = appointments.filter(app => app.status === "completed" || app.status === "cancelled" || new Date(app.dateTime) < new Date());


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center"><CalendarDays className="mr-3 h-8 w-8 text-primary" />My Appointments</CardTitle>
          <CardDescription>View and manage your medical appointments.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-3 gap-8 w-full mt-4">
              {upcomingAppointments.map(app => (
                <AppointmentCard key={app.id} appointment={app} onReschedule={handleReschedule} onCancel={handleCancel} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-8">No upcoming appointments.</p>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            <div className="grid grid-cols-3 gap-8 w-full mt-4">
              {pastAppointments.map(app => (
                <AppointmentCard key={app.id} appointment={app} onReschedule={handleReschedule} onCancel={handleCancel} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-8">No past or cancelled appointments.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
