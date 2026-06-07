"use client";

import { motion } from "framer-motion";
import { UserRole } from "@/types/task";
import { User, Building2 } from "lucide-react";

interface RoleToggleProps {
  role:       UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: "annotator", label: "Annotator", icon: User,      description: "View & manage assigned tasks" },
  { value: "client",    label: "Client",    icon: Building2,  description: "View project analytics" },
];

export function RoleToggle({ role, onRoleChange }: RoleToggleProps) {
  return (
    <div
      className="inline-flex rounded-xl border border-border bg-muted/40 p-1 gap-1"
      role="radiogroup"
      aria-label="Switch view role"
    >
      {ROLES.map(r => {
        const Icon    = r.icon;
        const active  = role === r.value;
        return (
          <button
            key={r.value}
            role="radio"
            aria-checked={active}
            onClick={() => onRoleChange(r.value)}
            className="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={r.description}
          >
            {active && (
              <motion.div
                layoutId="role-indicator"
                className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border"
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className={`h-4 w-4 ${active ? "text-foreground" : "text-muted-foreground"}`} aria-hidden="true" />
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{r.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}