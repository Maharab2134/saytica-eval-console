# Saytica Eval Console

A production-quality AI Evaluation Dashboard built with Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, React Query, and Framer Motion.

---

## Overview

Saytica Eval Console is a modern SaaS-style internal tool for AI annotation companies. It provides two core modules:

1. **Model Leaderboard** — Compare AI models by accuracy, latency, and cost with rich filtering and sorting
2. **Task Board** — Role-based task management with optimistic UI updates and analytics

---

## Features

### Model Leaderboard
- ✅ Search by model name or provider
- ✅ Sort by accuracy, latency, cost, or name (ascending/descending)
- ✅ Filter by provider
- ✅ Top performer cards (Best Accuracy, Fastest, Cheapest)
- ✅ Rank badges (🥇🥈🥉)
- ✅ Accuracy visual bars with color-coded thresholds
- ✅ Latency badges with slow-model detection (9999ms flagged)
- ✅ CSV export
- ✅ Loading skeletons, empty states, error states

### Task Board
- ✅ Role-based view: Annotator / Client
- ✅ Annotator: Kanban-style board with status flow (Pending → In Progress → Done)
- ✅ Client: Analytics dashboard with completion rates and project summaries
- ✅ Optimistic UI updates with rollback on error
- ✅ Status transitions validated on both client and server
- ✅ Toast notifications on success/failure
- ✅ CSV export of all tasks

### Dashboard
- ✅ Overview page with aggregated stats
- ✅ Top performer quick view
- ✅ Task completion progress bars

### UI/UX
- ✅ Dark mode (default) + Light mode toggle
- ✅ Responsive: Mobile, Tablet, Desktop
- ✅ Collapsible sidebar with smooth animation
- ✅ Framer Motion page transitions
- ✅ Donut chart for task distribution
- ✅ Animated progress bars
- ✅ Skeleton loaders
- ✅ Accessible: ARIA labels, keyboard navigation, focus states

---

## Architecture Decisions

### Data Layer
- JSON files served through Next.js API Routes (not imported directly in client components)
- This simulates a real backend while keeping the setup simple
- PATCH endpoint reads + writes JSON atomically for task status updates

### Normalization at the API Layer
All data cleaning happens in `src/lib/normalize.ts` — called exclusively inside API routes. Client components receive clean, typed data.

### React Query
- `staleTime: 30-60s` prevents unnecessary refetches
- Optimistic updates for task status changes (roll back on error)
- Query invalidation after mutation settles

### Component Architecture

app/ — Pages (Server Components, metadata)
components/ — Presentational and smart components
layout/ — Sidebar, Header, MobileNav
leaderboard/ — Leaderboard-specific components
tasks/ — Task board, role toggle, client dashboard
cards/ — Reusable stat/performer cards
tables/ — Model table with sort
charts/ — Custom SVG donut chart
shared/ — EmptyState, ErrorState, StatusBadge, etc.
ui/ — ShadCN primitives (Button, Input, Select…)
hooks/ — useModels, useTasks (data + business logic)
services/ — Fetch wrappers (modelService, taskService)
lib/ — normalize, analytics, export, utils
types/ — model.ts, task.ts, api.ts
providers/ — QueryProvider, ThemeProvider


---

## Data Cleaning Strategy

| Issue | Input | Output | Strategy |
|-------|-------|--------|----------|
| Provider case inconsistency | `openforma` | `OpenForma` | Lowercase key lookup in `PROVIDER_MAP` |
| Model name whitespace | `"  Polyglot-Pro "` | `"Polyglot-Pro"` | `.trim()` on all name fields |
| Null accuracy | `null` | `"N/A"` | Null-safe formatting in `formatAccuracy()` |
| Null cost | `null` | `"N/A"` | Null-safe formatting in `formatCost()` |
| Mixed date formats | `"02/05/2026"` | `"2026-05-02"` | Regex detection + reformat in `normalizeDate()` |
| Invalid date | `null`, `""` | `null → "N/A"` | Returns null, displayed as "N/A" |
| Latency outlier | `9999` | Flagged as "Very Slow" | Threshold detection in `LatencyBadge` |
| Empty task status | `""` | `"unknown"` | `normalizeStatus()` returns `"unknown"` |
| Null assignee | `null` | `"Unassigned"` | UI checks for null |

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| JSON file as DB | ✅ Zero infra, ❌ not concurrent-safe (use real DB in production) |
| Normalization at API layer | ✅ Clean separation, ❌ slight overhead per request |
| No state management library | ✅ Simpler with React Query, ❌ less flexibility for complex cross-slice state |
| Custom SVG donut | ✅ No charting library dependency, ❌ less feature-rich than Recharts |
| Server Components for pages | ✅ Better SEO + fast initial load, ❌ interactivity moved to client wrappers |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Maharab2134/saytica-eval-console
cd saytica-eval-console
npm install