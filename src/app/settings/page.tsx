import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Database,
  Eye,
  Lock,
  Palette,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Settings",
  description: "Adjust application preferences and account settings",
};

const SETTINGS_SECTIONS = [
  {
    title: "Appearance",
    icon: Palette,
    description: "Tune the visual style of the console to fit your workflow.",
    bullets: ["Dark or light mode", "Compact spacing", "Readable typography"],
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Control how and when important updates reach you.",
    bullets: ["Task changes", "Model alerts", "Weekly summaries"],
  },
  {
    title: "Privacy",
    icon: ShieldCheck,
    description: "Decide what activity is visible across the workspace.",
    bullets: ["Session history", "Performance tracking", "Private notes"],
  },
  {
    title: "Data & Export",
    icon: Database,
    description: "Keep your evaluation data portable and auditable.",
    bullets: ["CSV export", "JSON backup", "Retention rules"],
  },
] as const;

const QUICK_ITEMS = [
  { label: "Profile ready", value: "92%", icon: Eye, tone: "text-emerald-500" },
  { label: "Security checks", value: "4", icon: Lock, tone: "text-sky-500" },
  { label: "Workspace presets", value: "8", icon: SlidersHorizontal, tone: "text-amber-500" },
] as const;

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/40 p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(var(--primary)/0.14),transparent_30%),radial-gradient(circle_at_bottom_left,hsla(var(--muted)/0.24),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Workspace configuration
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Make the console feel like your own command center.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                Centralize appearance, privacy, and notification preferences so the
                dashboard stays clean, focused, and easy to use every day.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/help">Open help</Link>
            </Button>
            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {QUICK_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
                    {item.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Icon className={`h-5 w-5 ${item.tone}`} aria-hidden="true" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SETTINGS_SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <section
              key={section.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Recommended setup flow</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start here if you want the interface tuned for daily review work.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/help">Read help</Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              "Pick a theme and density level",
              "Set alert preferences for tasks",
              "Review privacy and export choices",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">Quick actions</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "Toggle theme", hint: "Switch appearance from the header" },
              { label: "Review roles", hint: "Check who owns tasks and models" },
              { label: "Open help", hint: "See usage guidance and shortcuts" },
            ].map((action) => (
              <div
                key={action.label}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{action.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
            Settings will stay responsive on desktop and mobile, and the links above
            take you back to the rest of the console when needed.
          </div>
        </section>
      </div>
    </div>
  );
}
