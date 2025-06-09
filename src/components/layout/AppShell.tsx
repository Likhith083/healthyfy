"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./AppSidebarContent";
import { Skeleton } from "@/components/ui/skeleton";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // To determine current route for auth check

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    // Check if user is trying to access a page not matching their role
    if (user && !isLoading) {
      const pathRole = pathname.split('/')[1];
      if (pathRole && user.role !== pathRole && !['login', 'signup'].includes(pathRole)) {
        router.push(`/${user.role}/dashboard`);
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    // Full page loader or skeleton
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <div className="flex flex-1">
          <div className="hidden md:block w-64 border-r p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <main className="flex-1 p-6 space-y-6">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-[calc(100vh-4rem)]"> {/* 4rem is header height */}
        <Sidebar collapsible="icon">
          <AppSidebarContent userRole={user.role} />
        </Sidebar>
        <SidebarInset>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
