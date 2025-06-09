"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to save settings to localStorage or backend
    toast({ title: "Settings Saved", description: "System settings have been updated (simulated)." });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Settings className="mr-3 h-8 w-8 text-primary" />System Settings
          </CardTitle>
          <CardDescription>Configure global settings for HealthMatch Direct.</CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input id="appName" defaultValue="HealthMatch Direct" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenanceMode" />
              <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
            </div>
             <div className="space-y-2">
              <Label htmlFor="defaultAppointmentDuration">Default Appointment Duration (minutes)</Label>
              <Input id="defaultAppointmentDuration" type="number" defaultValue="30" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings (Placeholder)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="emailNotifications" defaultChecked/>
              <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="smsNotifications" />
              <Label htmlFor="smsNotifications">Enable SMS Notifications (API Key Required)</Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>AI Matching Settings (Placeholder)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="aiConfidenceThreshold">AI Confidence Threshold (0-1)</Label>
                    <Input id="aiConfidenceThreshold" type="number" step="0.1" min="0" max="1" defaultValue="0.7" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fallbackSpecialist">Default Fallback Specialist</Label>
                    <Input id="fallbackSpecialist" defaultValue="General Physician" />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </div>
  );
}
