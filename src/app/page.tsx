import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Activity, Users, Stethoscope, Brain, ArrowRight, CheckCircle2, Clock, Heart } from "lucide-react";
import { Metadata } from "next";
import { cn } from '@/lib/animations';
import { Loading } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: "Health Service Portal - Your Healthcare Journey Starts Here",
  description: "Connect with healthcare professionals, manage your appointments, and access your medical records all in one place.",
  keywords: "healthcare, medical portal, doctor appointments, patient portal, medical records",
};
//cool stuff to do
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Health Portal</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="w-full px-8 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Your Healthcare Journey Starts Here
                </h1>
                <p className="text-xl text-muted-foreground">
                  Connect with healthcare professionals, manage your appointments, and access your medical records all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors hover-lift"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors hover-lift"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[600px] animate-zoom-in">
                <Image
                  src="https://placehold.co/1920x1080.png?text=Hero+Doctors"
                  alt="Healthcare professionals"
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/50">
          <div className="w-full px-8">
            <div className="text-center space-y-4 mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform makes it easy to manage your healthcare needs in three simple steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Heart className="h-12 w-12 text-primary" />,
                  title: "Create Your Profile",
                  description: "Sign up and create your personalized health profile to get started.",
                },
                {
                  icon: <Stethoscope className="h-12 w-12 text-primary" />,
                  title: "Find Your Doctor",
                  description: "Browse through our network of qualified healthcare professionals.",
                },
                {
                  icon: <Clock className="h-12 w-12 text-primary" />,
                  title: "Book Appointments",
                  description: "Schedule and manage your appointments with ease.",
                },
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative p-6 bg-background rounded-lg shadow-lg hover-lift animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="w-full px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative h-[400px] lg:h-[600px] animate-zoom-in">
                <Image
                  src="https://placehold.co/1920x1080.png?text=App+Interface"
                  alt="Platform interface"
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Features That Make a Difference
                </h2>
                <div className="space-y-4">
                  {[
                    "Secure medical record storage",
                    "Real-time appointment scheduling",
                    "Direct messaging with healthcare providers",
                    "Prescription management",
                    "Health tracking and analytics",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/features" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors hover-lift"
                >
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="w-full px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Health Portal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner in healthcare management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  Email: support@healthportal.com
                </li>
                <li className="text-sm text-muted-foreground">
                  Phone: (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Health Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
