import { useState } from "react";
import { Checkbox } from "../../components/checkbox";
import { Label } from "../../components/label";
import { cn } from "../../lib/cn";
import { DashboardCard } from "../../widgets/dashboard-card";

const initial = [
  { id: "t1", text: "Send the proposal to Contoso", due: "Today", done: false },
  { id: "t2", text: "Call Northwind about the contract", due: "Today", done: false },
  { id: "t3", text: "Update the pipeline notes", due: "Tomorrow", done: true },
  { id: "t4", text: "Book a demo for Fabrikam", due: "Fri", done: false },
  { id: "t5", text: "Review last week's lost deals", due: "Mon", done: false },
];

export function TasksCard({ className }: Readonly<{ className?: string }>) {
  const [tasks, setTasks] = useState(initial);
  const open = tasks.filter((task) => !task.done).length;
  return (
    <DashboardCard
      title="Tasks"
      description={`${open} to do. Check one off.`}
      className={className}
    >
      <ul className="grid gap-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start gap-3">
            <Checkbox
              id={task.id}
              className="mt-0.5"
              checked={task.done}
              onCheckedChange={(checked) =>
                setTasks((current) =>
                  current.map((item) =>
                    item.id === task.id ? { ...item, done: checked === true } : item,
                  ),
                )
              }
            />
            <Label
              htmlFor={task.id}
              className={cn(
                "grid flex-1 gap-0.5 leading-snug",
                task.done && "text-muted-foreground line-through",
              )}
            >
              <span>{task.text}</span>
              <span className="text-xs text-muted-foreground no-underline">{task.due}</span>
            </Label>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
