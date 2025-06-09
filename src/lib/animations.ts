import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fadeIn = "animate-in fade-in duration-300";
export const fadeOut = "animate-out fade-out duration-300";
export const slideIn = "animate-in slide-in-from-bottom duration-300";
export const slideOut = "animate-out slide-out-to-bottom duration-300";
export const scaleIn = "animate-in zoom-in duration-300";
export const scaleOut = "animate-out zoom-out duration-300";

export const transitions = {
  default: "transition-all duration-300 ease-in-out",
  fast: "transition-all duration-150 ease-in-out",
  slow: "transition-all duration-500 ease-in-out",
};

export const hoverEffects = {
  lift: "hover:-translate-y-1 hover:shadow-lg transition-all duration-200",
  scale: "hover:scale-105 transition-transform duration-200",
  glow: "hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-shadow duration-200",
};

export const focusEffects = {
  ring: "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
  glow: "focus:shadow-[0_0_15px_rgba(var(--primary),0.3)] focus:outline-none",
}; 