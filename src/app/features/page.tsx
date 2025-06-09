import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Lock, CalendarDays, MessageSquare, FileText, BarChart3 } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Lock className="h-8 w-8 text-primary" />, title: "Secure Medical Records", description: "Your health data is encrypted and stored securely, accessible only to you and your authorized providers."
    },
    {
      icon: <CalendarDays className="h-8 w-8 text-primary" />, title: "Real-time Scheduling", description: "Book, reschedule, or cancel appointments instantly with our intuitive calendar."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />, title: "Direct Messaging", description: "Communicate directly with your healthcare providers for quick questions and follow-ups."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />, title: "Prescription Management", description: "Track prescriptions, request refills, and view your medication history in one place."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />, title: "Health Analytics", description: "Visualize your health trends and progress with easy-to-read analytics and charts."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />, title: "Specialist Matching", description: "Get matched with the right specialist based on your symptoms and health needs."
    },
  ];

  return (
    <div className="min-h-screen bg-background w-full px-16 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Platform Features</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Discover the tools and services that make HealthMatch Direct your all-in-one healthcare portal.</p>
      </div>
      <div className="grid grid-cols-3 gap-10 w-full">
        {features.map((feature, idx) => (
          <Card key={idx} className="p-6 flex flex-col items-center gap-4 shadow-md">
            <div>{feature.icon}</div>
            <CardHeader className="p-0 text-center">
              <CardTitle className="text-xl mb-1">{feature.title}</CardTitle>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
} 