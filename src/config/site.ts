import type { UserRole } from "@/types";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, CalendarDays, Users, UserCog, Settings, Stethoscope, UserPlus, ClipboardEdit } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  roles: UserRole[];
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard", // Base path, will be prefixed by role
    icon: LayoutDashboard,
    roles: ["patient", "doctor", "admin"],
  },
  {
    title: "My Appointments",
    href: "/appointments",
    icon: CalendarDays,
    roles: ["patient"],
  },
  {
    title: "My Profile", // For patient, shows assigned doctor. For doctor, their profile.
    href: "/profile",
    icon: UserCog, // Using UserCog for a general profile icon
    roles: ["patient", "doctor"],
  },
  {
    title: "Submit Symptoms",
    href: "/symptoms",
    icon: ClipboardEdit,
    roles: ["patient"],
  },
  {
    title: "Assigned Patients",
    href: "/patients",
    icon: Users,
    roles: ["doctor"],
  },
  {
    title: "Manage Appointments",
    href: "/appointments",
    icon: CalendarDays,
    roles: ["doctor", "admin"],
  },
  {
    title: "Manage Patients",
    href: "/patients",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Manage Doctors",
    href: "/doctors",
    icon: Stethoscope, // Using Stethoscope for doctors
    roles: ["admin"],
  },
  {
    title: "System Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export const getNavItemsForRole = (role: UserRole): NavItem[] => {
  return navItems
    .filter(item => item.roles.includes(role))
    .map(item => ({ ...item, href: `/${role}${item.href}` }));
};
