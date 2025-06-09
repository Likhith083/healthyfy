"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getDoctorProfile, updateDoctorProfile, findUserById, updateUser } from "@/lib/dataService";
import type { User, DoctorProfile as DoctorProfileType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stethoscope, Edit3, Save, Mail, Briefcase, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";


const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  specialization: z.string().min(2, "Specialization is required"),
  bio: z.string().optional(),
  availability: z.string().optional(),
  profilePictureUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function DoctorProfilePage() {
  const { user, logout } // assuming useAuth updates user on successful login/signup
    = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user && user.role === 'doctor') {
      console.log('Logged-in doctor userId:', user.id); // Log the userId
      const profile = getDoctorProfile(user.id);
      setDoctorProfile(profile || null);
      form.reset({
        name: user.name,
        email: user.email,
        specialization: profile?.specialization || "",
        bio: profile?.bio || "",
        availability: profile?.availability || "",
        profilePictureUrl: profile?.profilePictureUrl || "",
      });
    }
  }, [user, form]);
  
  const getInitials = (name?: string) => {
    if (!name) return "Dr";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    if (!user || !doctorProfile) return;

    const updatedUser: User = { ...user, name: data.name, email: data.email };
    updateUser(updatedUser); // Update general user info

    const updatedProfile: DoctorProfileType = { 
        ...doctorProfile, 
        specialization: data.specialization, 
        bio: data.bio,
        availability: data.availability,
        profilePictureUrl: data.profilePictureUrl || doctorProfile.profilePictureUrl // Keep old if new is empty
    };
    updateDoctorProfile(updatedProfile);
    
    // Re-fetch or update local state if useAuth doesn't auto-update
    // For simplicity, assuming useAuth hook would reflect changes or a page reload would.
    // To immediately reflect: setUser({...user, ...updatedUser}); setDoctorProfile(updatedProfile);

    toast({ title: "Profile Updated", description: "Your profile details have been saved." });
    setIsEditing(false);
  };

  if (!user || !doctorProfile) return <div className="p-8 text-center">Loading doctor profile...</div>;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Stethoscope className="mr-3 h-8 w-8 text-primary" /> Doctor Profile
          </CardTitle>
          <CardDescription>Manage your professional information and availability.</CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <Image
                src={form.watch("profilePictureUrl") || doctorProfile.profilePictureUrl || `https://placehold.co/150x150.png?text=${getInitials(user.name)}`}
                alt={user.name}
                width={150}
                height={150}
                className="rounded-full border-4 border-primary object-cover"
                data-ai-hint="doctor avatar"
              />
              {isEditing && (
                <div className="w-full space-y-1">
                    <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                    <Input id="profilePictureUrl" {...form.register("profilePictureUrl")} placeholder="https://example.com/image.png" />
                </div>
              )}
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? <Input id="name" {...form.register("name")} /> : <p className="text-lg font-medium p-2">{user.name}</p>}
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email"><Mail className="inline mr-2 h-4 w-4 text-muted-foreground"/>Email</Label>
                {isEditing ? <Input id="email" type="email" {...form.register("email")} /> : <p className="text-lg p-2">{user.email}</p>}
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="specialization"><Briefcase className="inline mr-2 h-4 w-4 text-muted-foreground"/>Specialization</Label>
                {isEditing ? <Input id="specialization" {...form.register("specialization")} /> : <p className="text-lg p-2">{doctorProfile.specialization}</p>}
                {form.formState.errors.specialization && <p className="text-sm text-destructive">{form.formState.errors.specialization.message}</p>}
              </div>
               <div>
                <Label htmlFor="availability"><CalendarClock className="inline mr-2 h-4 w-4 text-muted-foreground"/>Availability</Label>
                {isEditing ? <Input id="availability" {...form.register("availability")} placeholder="e.g., Mon, Wed, Fri 9am-5pm"/> : <p className="text-lg p-2">{doctorProfile.availability || "Not specified"}</p>}
              </div>
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                {isEditing ? <Textarea id="bio" {...form.register("bio")} rows={4} placeholder="Tell patients about your experience and approach..."/> : <p className="text-sm p-2 bg-secondary/30 rounded-md min-h-[60px]">{doctorProfile.bio || "No bio provided."}</p>}
              </div>
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); form.reset(); }}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}><Save className="mr-2 h-4 w-4" /> {form.formState.isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </CardFooter>
          )}
        </Card>
      </form>

      {/* Logout Button */}
      <div className="flex justify-center mt-8">
        <Button variant="destructive" onClick={logout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
