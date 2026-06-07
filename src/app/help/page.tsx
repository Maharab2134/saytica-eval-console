import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help",
  description: "Find guidance for using the evaluation console",
};

const HELP_TOPICS = [
  {
    title: "Dashboard",
    icon: Sparkles,
    description:
      "Understand the headline metrics and how they reflect your workspace health.",
    points: [
      "Total models and tasks",
      "Completion summary",
      "Top performers snapshot",
    ],
  },
  {
    title: "Leaderboard",
    icon: CheckCircle2,
    description:
      "Compare models by accuracy, latency, and cost before promoting them.",
    points: [
      "Sort by performance",
      "Inspect model tradeoffs",
      "Track top candidates",
    ],
  },
  {
    title: "Tasks",
    icon: BookOpen,
    description: "Manage assignments and progress in one place.",
    points: [
      "Move tasks across states",
      "Filter by role",
      "Monitor completion rate",
    ],
  },
  {
    title: "Shortcuts",
    icon: Keyboard,
    description: "Use the fast paths already built into the shell.",
    points: [
      "Theme toggle in the header",
      "Mobile drawer navigation",
      "Sidebar collapse control",
    ],
  },
] as const;

const FAQ = [
  {
    question: "Why do Settings and Help now open pages?",
    answer:
      "They are real routes under /settings and /help, so sidebar clicks now navigate instead of doing nothing.",
  },
  {
    question: "Where is the brand link?",
    answer:
      "The top-left brand and the header title both link back to the dashboard.",
  },
  {
    question: "What if a page looks empty?",
    answer:
      "Check whether the API data is loaded; the dashboard cards and tables depend on the model and task endpoints.",
  },
] as const;

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(var(--primary)/0.12),transparent_28%),radial-gradient(circle_at_bottom_right,hsla(var(--muted)/0.28),transparent_32%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <HelpCircle className="h-3.5 w-3.5 text-sky-500" />
              Help center
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to move around the console faster.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                This page explains the main views, highlights useful shortcuts,
                and answers the most common navigation questions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/settings">Open settings</Link>
            </Button>
            <Button asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Quick start",
            value: "3 min",
            icon: Search,
            tone: "text-sky-500",
          },
          {
            label: "Core views",
            value: "3",
            icon: BookOpen,
            tone: "text-emerald-500",
          },
          {
            label: "Shortcuts",
            value: "4",
            icon: Keyboard,
            tone: "text-amber-500",
          },
          {
            label: "Common issues",
            value: "1 page",
            icon: AlertCircle,
            tone: "text-rose-500",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {item.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <item.icon
                  className={`h-5 w-5 ${item.tone}`}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {HELP_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <section
              key={topic.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Icon
                    className="h-5 w-5 text-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{topic.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {topic.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <LifeBuoy className="h-5 w-5 text-sky-500" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Need help now?</h3>
              <p className="text-sm text-muted-foreground">
                Use the navigation links or jump back to the dashboard.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              "The top bar includes theme switching and the user avatar.",
              "The sidebar groups dashboard, leaderboard, tasks, settings, and help.",
              "Mobile users get the same routes from the drawer menu.",
            ].map((line) => (
              <div
                key={line}
                className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground"
              >
                {line}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/leaderboard">Open leaderboard</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/tasks">Open tasks</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-lg font-semibold">Frequently asked questions</h3>
          <div className="mt-4 space-y-3">
            {FAQ.map((entry) => (
              <div
                key={entry.question}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {entry.question}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
            If a screen does not look right, refresh once after the data loads.
            The dashboard depends on the API responses from the models and tasks
            routes.
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Want to return? Open the{" "}
        <Link
          href="/"
          className="font-medium text-foreground underline underline-offset-4"
        >
          dashboard
        </Link>
        .
      </div>
    </div>
  );
}
