"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getUsers, getDoctorProfile, addDoctorProfile as addDataDoctorProfile, updateUser, updateDoctorProfile, removeUser as removeUserData, addUser as addDataUser, findUserById } from "@/lib/dataService";
import type { User, DoctorProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Edit3, UserPlus, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";

const doctorFormSchema = z.object({
  id: z.string().optional(), // For editing
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(), // Optional for edit
  specialization: z.string().min(2, "Specialization is required"),
  bio: z.string().optional(),
  availability: z.string().optional(),
});
type DoctorFormValues = z.infer<typeof doctorFormSchema>;

export default function AdminManageDoctorsPage() {
  const [doctors, setDoctors] = useState<(User & { profile?: DoctorProfile })[]>([]);
  const [filter, setFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<(User & { profile?: DoctorProfile }) | null>(null);
  const { toast } = useToast();
  
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: { name: "", email: "", specialization: "", bio: "", availability: "" },
  });

  useEffect(() => {
    loadDoctors();
  }, []);
  
  const loadDoctors = () => {
    const doctorUsers = getUsers("doctor");
    const hydratedDoctors = doctorUsers.map(user => ({
      ...user,
      profile: getDoctorProfile(user.id)
    }));
    setDoctors(hydratedDoctors);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => 
      d.name.toLowerCase().includes(filter.toLowerCase()) || 
      d.email.toLowerCase().includes(filter.toLowerCase()) ||
      d.profile?.specialization.toLowerCase().includes(filter.toLowerCase())
    );
  }, [doctors, filter]);

  const handleFormSubmit: SubmitHandler<DoctorFormValues> = (data) => {
    try {
      if (editingDoctor?.id) { // Editing existing doctor
        const updatedUser = { ...findUserById(editingDoctor.id)!, name: data.name, email: data.email };
        if (data.password) updatedUser.password = data.password; // Update password if provided
        updateUser(updatedUser);

        const updatedProfile = { ...editingDoctor.profile!, userId: editingDoctor.id, specialization: data.specialization, bio: data.bio, availability: data.availability };
        updateDoctorProfile(updatedProfile);
        toast({ title: "Success", description: "Doctor updated successfully." });
      } else { // Adding new doctor
        if (!data.password) {
          toast({ title: "Error", description: "Password is required for new doctors.", variant: "destructive"});
          form.setError("password", {type: "manual", message: "Password is required"});
          return;
        }
        const newUser = addDataUser({ name: data.name, email: data.email, password: data.password, role: 'doctor' });
        addDataDoctorProfile({ userId: newUser.id, specialization: data.specialization, bio: data.bio, availability: data.availability });
        toast({ title: "Success", description: "Doctor added successfully." });
      }
      loadDoctors();
      setIsFormOpen(false);
      setEditingDoctor(null);
      form.reset();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to save doctor.", variant: "destructive"});
    }
  };

  const handleEdit = (doctor: User & { profile?: DoctorProfile }) => {
    setEditingDoctor(doctor);
    form.reset({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.profile?.specialization || "",
      bio: doctor.profile?.bio || "",
      availability: doctor.profile?.availability || ""
      // Password is not pre-filled for security
    });
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingDoctor(null);
    form.reset({ name: "", email: "", specialization: "", bio: "", availability: "" });
    setIsFormOpen(true);
  };

  const handleRemoveDoctor = (doctorId: string) => {
    removeUserData(doctorId); // This also removes associated doctor profile
    loadDoctors();
    toast({ title: "Success", description: "Doctor removed successfully." });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center"><Stethoscope className="mr-3 h-8 w-8 text-primary" />Manage Doctors</CardTitle>
          <CardDescription>Add, edit, and remove doctor accounts and profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Filter doctors..."
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleAddNew}><UserPlus className="mr-2 h-4 w-4" /> Add New Doctor</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.profile?.specialization || 'N/A'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(doctor)}>
                          <Edit3 className="mr-1 h-4 w-4" /> Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4" /> Remove</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove Dr. {doctor.name} and all their data. This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveDoctor(doctor.id)}>Confirm Removal</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">No doctors found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>{editingDoctor ? "Update the doctor's details." : "Enter the new doctor's information."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" {...form.register("name")} className="col-span-3" />
              {form.formState.errors.name && <p className="col-span-4 text-right text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" {...form.register("email")} className="col-span-3" />
              {form.formState.errors.email && <p className="col-span-4 text-right text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input id="password" type="password" {...form.register("password")} className="col-span-3" placeholder={editingDoctor ? "Leave blank to keep current" : ""}/>
              {form.formState.errors.password && <p className="col-span-4 text-right text-sm text-destructive">{form.formState.errors.password.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">Specialization</Label>
              <Input id="specialization" {...form.register("specialization")} className="col-span-3" />
              {form.formState.errors.specialization && <p className="col-span-4 text-right text-sm text-destructive">{form.formState.errors.specialization.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Input id="bio" {...form.register("bio")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">Availability</Label>
              <Input id="availability" {...form.register("availability")} className="col-span-3" placeholder="e.g., Mon-Fri 9am-5pm" />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving..." : "Save Doctor"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
