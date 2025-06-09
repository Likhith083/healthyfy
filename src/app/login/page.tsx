import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
       <div className="absolute inset-0 opacity-10 z-0" style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }}>
        <Image 
          src="https://placehold.co/1920x1080.png?text=Health+Pattern" 
          alt="Abstract background pattern" 
          fill
          style={{ objectFit: "cover" }}
          data-ai-hint="medical pattern"
        />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
