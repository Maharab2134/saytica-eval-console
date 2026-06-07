import type { Metadata } from "next";
import { TasksClient } from "@/components/tasks/TasksClient";

export const metadata: Metadata = {
  title:       "Task Board",
  description: "Manage annotation tasks by role",
};

export default function TasksPage() {
  return <TasksClient />;
}