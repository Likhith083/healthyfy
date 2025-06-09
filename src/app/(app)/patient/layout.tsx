"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'patient')) {
      router.push('/login'); 
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'patient') {
    // You can return a loading spinner or null here
    return <div className="flex justify-center items-center h-screen"><p>Loading patient portal...</p></div>;
  }

  return <>{children}</>;
}
