"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { matchSpecialist } from '@/ai/flows/match-specialist';
import { getPatientData, updatePatientData, getDoctorsBySpecialization, addAppointment, findUserById } from '@/lib/dataService';
import type { SymptomEntry, DoctorProfile } from '@/types';
import { Brain, Send, Stethoscope, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { fadeIn, slideIn, hoverEffects } from '@/lib/animations';
import { cn } from '@/lib/utils';

const symptomSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
});

type SymptomFormInputs = z.infer<typeof symptomSchema>;

interface MatchResult {
  specialistType: string;
  assignedDoctor?: DoctorProfile & { doctorUserId: string, doctorName: string };
  appointmentId?: string;
  doctorResponse?: string;
}

export function SymptomForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SymptomFormInputs>({
    resolver: zodResolver(symptomSchema),
  });

  const onSubmit: SubmitHandler<SymptomFormInputs> = async (data) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setMatchResult(null);

    try {
      const result = await matchSpecialist({ symptoms: data.symptoms });
      const specialistType = result.specialist;
      const doctorResponse = result.doctorResponse;

      toast({
        title: "Symptoms Analyzed",
        description: `Our AI suggests a ${specialistType}. We're now finding a suitable doctor.`,
      });
      
      let patientData = getPatientData(user.id);
      if (!patientData) {
        patientData = { userId: user.id, symptomsLog: [], assignedDoctorId: undefined };
      }
      
      const newSymptomEntry: SymptomEntry = {
        id: `sym-${Date.now()}`,
        date: new Date().toISOString(),
        symptoms: data.symptoms,
        matchedSpecialist: specialistType,
      };
      patientData.symptomsLog.push(newSymptomEntry);

      let assignedDoctor: (DoctorProfile & { doctorUserId: string, doctorName: string }) | undefined = undefined;
      let doctorsOfSpecialty = getDoctorsBySpecialization(specialistType);
      
      if (doctorsOfSpecialty.length === 0 && specialistType !== "General Physician") {
        doctorsOfSpecialty = getDoctorsBySpecialization("General Physician");
      }

      if (doctorsOfSpecialty.length > 0) {
        const chosenDoctorProfile = doctorsOfSpecialty[0];
        const doctorUser = findUserById(chosenDoctorProfile.userId);
        if (doctorUser) {
          patientData.assignedDoctorId = chosenDoctorProfile.userId;
          assignedDoctor = { ...chosenDoctorProfile, doctorUserId: chosenDoctorProfile.userId, doctorName: doctorUser.name };
          
          const appointment = addAppointment({
            patientId: user.id,
            doctorId: chosenDoctorProfile.userId,
            dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "pending",
            reason: `Symptoms: ${data.symptoms.substring(0,100)}... (Matched to ${specialistType})`,
          });
          setMatchResult({ specialistType, assignedDoctor, appointmentId: appointment.id, doctorResponse });
        }
      } else {
        setMatchResult({ specialistType, doctorResponse });
      }

      updatePatientData(patientData);
      
      toast({
        title: "Symptoms Submitted Successfully",
        description: assignedDoctor 
          ? `You've been matched with Dr. ${assignedDoctor.doctorName} (${specialistType}). An appointment has been requested.`
          : `We've logged your symptoms. Our AI suggests a ${specialistType}. We'll notify you when a doctor is assigned.`,
      });
      reset();

    } catch (error) {
      console.error("Symptom submission error:", error);
      toast({
        title: "Submission Error",
        description: "Could not process symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl", fadeIn)}>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <Brain className="mr-2 h-7 w-7 text-primary" /> Describe Your Symptoms
        </CardTitle>
        <CardDescription>
          Provide a detailed description of your symptoms. Our system will help match you with the right specialist.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!matchResult ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="symptoms" className="text-lg">Your Symptoms</Label>
              <Textarea
                id="symptoms"
                rows={6}
                placeholder="e.g., I have a persistent cough, fever for 3 days, and chest pain when breathing deeply..."
                {...register("symptoms")}
                className={cn(
                  "mt-1 transition-all duration-200",
                  errors.symptoms ? "border-destructive" : "focus:border-primary",
                  hoverEffects.lift
                )}
              />
              {errors.symptoms && (
                <p className="text-sm text-destructive mt-1 animate-in fade-in slide-in-from-top">
                  {errors.symptoms.message}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className={cn(
                "w-full md:w-auto",
                hoverEffects.lift,
                isSubmitting && "opacity-75 cursor-not-allowed"
              )} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loading size="sm" className="mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Symptoms
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className={cn("space-y-4 p-4 border border-primary/50 rounded-lg bg-primary/10", slideIn)}>
            <div className="flex items-center text-xl font-semibold text-primary">
              <CheckCircle className="mr-2 h-6 w-6" /> Symptom Analysis Complete
            </div>
            <p>Our AI suggests you may need to see a <strong>{matchResult.specialistType}</strong>.</p>
            {matchResult.doctorResponse && (
              <div className="mt-4 p-4 border border-primary/30 rounded-lg bg-background/50">
                <p className="text-muted-foreground">{matchResult.doctorResponse}</p>
              </div>
            )}
            {matchResult.assignedDoctor ? (
              <div className="mt-4 p-4 border border-green-500/50 rounded-lg bg-green-500/10">
                <h3 className="text-lg font-semibold text-green-700 flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5" /> Doctor Assigned!
                </h3>
                <p>You have been preliminarily matched with <strong>Dr. {matchResult.assignedDoctor.doctorName}</strong>, a {matchResult.assignedDoctor.specialization}.</p>
                <p className="mt-1">A new appointment request has been created for you. Please check your appointments page to confirm details.</p>
                <div className="mt-3 flex gap-2">
                  <Button asChild className={hoverEffects.lift}>
                    <Link href="/patient/appointments">View Appointments</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setMatchResult(null)}
                    className={hoverEffects.lift}
                  >
                    Submit New Symptoms
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 border border-yellow-500/50 rounded-lg bg-yellow-500/10">
                <h3 className="text-lg font-semibold text-yellow-700 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" /> Further Action Required
                </h3>
                <p>We currently don't have a {matchResult.specialistType} available matching your immediate criteria or all are fully booked. Your symptoms have been logged.</p>
                <p className="mt-1">Our team will review your case and assign a doctor as soon as possible. You can also try resubmitting or describing your symptoms differently if you wish.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setMatchResult(null)} 
                  className={cn("mt-3", hoverEffects.lift)}
                >
                  Describe Symptoms Again
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
