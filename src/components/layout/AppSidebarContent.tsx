"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { getNavItemsForRole } from "@/config/site";
import type { UserRole, NavItem } from "@/types"; // Ensure NavItem is exported from types or defined in config
import { cn } from "@/lib/utils";
import { Stethoscope } from "lucide-react";

interface AppSidebarContentProps {
  userRole: UserRole;
}

export function AppSidebarContent({ userRole }: AppSidebarContentProps) {
  const pathname = usePathname();
  const navItems = getNavItemsForRole(userRole);

  return (
    <>
      <div className="flex h-16 items-center justify-center border-b px-2 group-data-[collapsible=icon]:hidden">
        <Link href={`/${userRole}/dashboard`} className="flex items-center gap-2 font-semibold">
          <Stethoscope className="h-7 w-7 text-primary" />
          <span className="font-headline text-lg">HealthMatch</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant="default"
                  size="default"
                  className={cn(
                    "justify-start w-full",
                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${userRole}/dashboard`)
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "hover:bg-accent/50"
                  )}
                  tooltip={item.title}
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${userRole}/dashboard`)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </>
  );
}
