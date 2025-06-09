'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Heart, Stethoscope, Calendar, FileText, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-background flex justify-center items-start py-12">
      <div className="w-full max-w-6xl flex gap-10">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, lol!</CardTitle>
              <CardDescription>
                This is your personal health dashboard. Manage your appointments and health information.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 p-6">
              <span className="font-semibold">Submit Symptoms</span>
              <span className="text-sm text-muted-foreground">Not feeling well? Describe your symptoms to get matched with a specialist.</span>
              <Button className="mt-2 w-full">Describe Symptoms</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 p-6">
              <span className="font-semibold">My Appointments</span>
              <span className="text-sm text-muted-foreground">View, reschedule, or cancel your upcoming appointments.</span>
              <Button variant="outline" className="mt-2 w-full">Manage Appointments</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 p-6">
              <span className="font-semibold">My Profile</span>
              <span className="text-sm text-muted-foreground">View your profile details and assigned doctor information.</span>
              <Button variant="outline" className="mt-2 w-full">View Profile</Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          <Card className="flex flex-col items-center p-8 gap-3">
            <span className="font-semibold mb-2">Your Assigned Doctor</span>
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-2">
              <span className="text-muted-foreground">100 x 100</span>
            </div>
            <span className="font-semibold">Dr. John Citizen</span>
            <span className="text-sm text-muted-foreground">General Physician</span>
            <span className="text-xs text-muted-foreground">Phone: (555) 123-4567</span>
            <span className="text-xs text-muted-foreground">Available: 8am - 5pm</span>
          </Card>
          <Card className="p-8">
            <span className="font-semibold text-lg mb-2 block">Upcoming Appointments</span>
            <div className="flex flex-col gap-4">
              <Card className="bg-muted/30 p-4">
                <span className="font-semibold">Wednesday, June 11th, 2025 <span className="ml-2 px-2 py-0.5 rounded bg-muted text-xs font-medium">Pending</span></span>
                <div className="text-sm mt-1">
                  With: Dr. John Citizen (General Physician)<br />
                  Reason: Symptoms: I have a slight headache, and a stuffy nose. It has been raining a lot where I am, I feel a little u... (Matched to General Practitioner)
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto">View Details</Button>
              </Card>
              <Button variant="outline" className="w-full">View All Appointments</Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
} 