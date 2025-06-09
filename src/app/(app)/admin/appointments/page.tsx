"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getAppointments, updateAppointment, removeUser as removeData, findUserById, getDoctorProfile, getUsers } from "@/lib/dataService";
import type { Appointment, User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck2, Filter, Edit3, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterPatient, setFilterPatient] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState<Appointment["status"] | "all">("all");
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [allPatients, setAllPatients] = useState<User[]>([]);
  const [allDoctors, setAllDoctors] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
    setAllPatients(getUsers("patient"));
    setAllDoctors(getUsers("doctor"));
  }, []);

  const loadAppointments = () => {
    setAppointments(getAppointments().sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => 
      (app.patientName?.toLowerCase().includes(filterPatient.toLowerCase()) || app.patientId.includes(filterPatient)) &&
      (app.doctorName?.toLowerCase().includes(filterDoctor.toLowerCase()) || app.doctorId.includes(filterDoctor)) &&
      (filterStatus === "all" || app.status === filterStatus)
    );
  }, [appointments, filterPatient, filterDoctor, filterStatus]);

  const handleUpdateAppointment = (updatedAppt: Appointment) => {
    updateAppointment(updatedAppt);
    loadAppointments();
    setEditingAppointment(null);
    toast({ title: "Success", description: "Appointment updated." });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };
  
  const AppointmentEditForm: React.FC<{appointment: Appointment; onSave: (data: Appointment) => void; onCancel: () => void}> = ({ appointment, onSave, onCancel}) => {
    const [currentAppointment, setCurrentAppointment] = useState<Appointment>(appointment);
    const [newDate, setNewDate] = useState<Date | undefined>(parseISO(appointment.dateTime));
    const [newTime, setNewTime] = useState<string>(format(parseISO(appointment.dateTime), "HH:mm"));
    const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    const handleSubmit = () => {
        if (newDate) {
            const [hours, minutes] = newTime.split(':').map(Number);
            const combinedDateTime = new Date(newDate);
            combinedDateTime.setHours(hours, minutes);
            onSave({...currentAppointment, dateTime: combinedDateTime.toISOString()});
        }
    };

    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Appointment</DialogTitle>
                <DialogDescription>
                    Patient: {appointment.patientName} with Dr. {appointment.doctorName}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div>
                    <Label htmlFor="patient">Patient</Label>
                    <Select value={currentAppointment.patientId} onValueChange={(val) => setCurrentAppointment(p => ({...p!, patientId: val}))}>
                        <SelectTrigger id="patient"><SelectValue /></SelectTrigger>
                        <SelectContent>{allPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="doctor">Doctor</Label>
                    <Select value={currentAppointment.doctorId} onValueChange={(val) => setCurrentAppointment(p => ({...p!, doctorId: val}))}>
                        <SelectTrigger id="doctor"><SelectValue /></SelectTrigger>
                        <SelectContent>{allDoctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name} ({getDoctorProfile(d.id)?.specialization})</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                <CalendarCheck2 className="mr-2 h-4 w-4" />
                                {newDate ? format(newDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newDate} onSelect={setNewDate} /></PopoverContent>
                    </Popover>
                </div>
                 <div>
                    <Label>Time</Label>
                    <Select value={newTime} onValueChange={setNewTime}>
                        <SelectTrigger><SelectValue placeholder="Select a time" /></SelectTrigger>
                        <SelectContent>{availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                     <Select value={currentAppointment.status} onValueChange={(val) => setCurrentAppointment(p => ({...p!, status: val as Appointment["status"]}))}>
                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                        <SelectContent>{["pending", "confirmed", "cancelled", "completed", "rescheduled"].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="reason">Reason</Label>
                    <Input id="reason" value={currentAppointment.reason} onChange={(e) => setCurrentAppointment(p => ({...p!, reason: e.target.value}))} />
                </div>
                 <div>
                    <Label htmlFor="notes">Notes (Doctor)</Label>
                    <Input id="notes" value={currentAppointment.notes} onChange={(e) => setCurrentAppointment(p => ({...p!, notes: e.target.value}))} />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="button" onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
    );
  };


  const statusVariantMap: Record<Appointment["status"], "default" | "secondary" | "destructive" | "outline"> = {
    pending: "default", // Yellowish if possible, but default is fine
    confirmed: "default", // Greenish if possible
    cancelled: "destructive",
    completed: "secondary", // Bluish if possible
    rescheduled: "outline", // Orangish if possible
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center"><CalendarCheck2 className="mr-3 h-8 w-8 text-primary" />Manage All Appointments</CardTitle>
          <CardDescription>View, filter, and manage all appointments in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Input placeholder="Filter by patient name/ID..." value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)} />
            <Input placeholder="Filter by doctor name/ID..." value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)} />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Appointment["status"] | "all")}>
              <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["pending", "confirmed", "cancelled", "completed", "rescheduled"].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{format(parseISO(app.dateTime), "PPp")}</TableCell>
                      <TableCell>{app.patientName || app.patientId}</TableCell>
                      <TableCell>{app.doctorName || app.doctorId}</TableCell>
                      <TableCell>{app.doctorSpecialization || 'N/A'}</TableCell>
                      <TableCell><Badge variant={statusVariantMap[app.status] || 'default'} className="capitalize">{app.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditAppointment(app)}>
                          <Edit3 className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        {/* Add delete/cancel if needed, careful with data integrity */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">No appointments match filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {editingAppointment && (
        <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && setEditingAppointment(null)}>
            <AppointmentEditForm appointment={editingAppointment} onSave={handleUpdateAppointment} onCancel={() => setEditingAppointment(null)} />
        </Dialog>
      )}
    </div>
  );
}
