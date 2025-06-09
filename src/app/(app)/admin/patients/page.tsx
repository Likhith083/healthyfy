"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getUsers, getPatientData, updatePatientData, removeUser as removeUserData, findUserById, getAllDoctorProfiles } from "@/lib/dataService";
import type { User, PatientData, DoctorProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Edit3, UserSearch, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminManagePatientsPage() {
  const [patients, setPatients] = useState<User[]>([]);
  const [patientDetails, setPatientDetails] = useState<Record<string, PatientData>>({});
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [filter, setFilter] = useState("");
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    setDoctors(getAllDoctorProfiles());
  }, []);

  const loadData = () => {
    const patientUsers = getUsers("patient");
    setPatients(patientUsers);
    const details: Record<string, PatientData> = {};
    patientUsers.forEach(p => {
      const data = getPatientData(p.id);
      if (data) details[p.id] = data;
    });
    setPatientDetails(details);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.email.toLowerCase().includes(filter.toLowerCase()));
  }, [patients, filter]);

  const handleReassignDoctor = (patientId: string, newDoctorId: string) => {
    const pData = patientDetails[patientId];
    if (pData) {
      const updatedPData = { ...pData, assignedDoctorId: newDoctorId };
      updatePatientData(updatedPData);
      setPatientDetails(prev => ({ ...prev, [patientId]: updatedPData }));
      toast({ title: "Success", description: "Patient reassigned successfully." });
      setEditingPatient(null); // Close modal if open
    }
  };
  
  const handleRemovePatient = (patientId: string) => {
    removeUserData(patientId);
    loadData(); // Refresh data
    toast({ title: "Success", description: "Patient removed successfully." });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center"><Users className="mr-3 h-8 w-8 text-primary" />Manage Patients</CardTitle>
          <CardDescription>View, edit, and manage patient accounts and assignments.</CardDescription>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Doctor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const details = patientDetails[patient.id];
                    const assignedDoctorUser = details?.assignedDoctorId ? findUserById(details.assignedDoctorId) : null;
                    const assignedDoctorProfile = details?.assignedDoctorId ? doctors.find(d => d.userId === details.assignedDoctorId) : null;
                    return (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          {assignedDoctorUser ? `${assignedDoctorUser.name} (${assignedDoctorProfile?.specialization || 'N/A'})` : 'Not Assigned'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => details && setEditingPatient(details)}>
                                <Edit3 className="mr-1 h-4 w-4" /> Reassign
                              </Button>
                            </AlertDialogTrigger>
                             {editingPatient && editingPatient.userId === patient.id && (
                               <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reassign Doctor for {patient.name}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Select a new doctor for this patient. Current: {assignedDoctorUser ? `${assignedDoctorUser.name} (${assignedDoctorProfile?.specialization})` : 'None'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Select onValueChange={(newDoctorId) => handleReassignDoctor(patient.id, newDoctorId)} defaultValue={details?.assignedDoctorId}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a new doctor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {doctors.map(doc => {
                                      const docUser = findUserById(doc.userId);
                                      return (
                                        <SelectItem key={doc.userId} value={doc.userId}>
                                          {docUser?.name} ({doc.specialization})
                                        </SelectItem>
                                      );
                                    })}
                                    <SelectItem value="">None (Unassign)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setEditingPatient(null)}>Cancel</AlertDialogCancel>
                                  {/* Action is handled by Select's onValueChange */}
                                </AlertDialogFooter>
                              </AlertDialogContent>
                             )}
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4" /> Remove</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently remove {patient.name} and all their data. This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemovePatient(patient.id)}>Confirm Removal</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No patients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
