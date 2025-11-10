import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  status: "done" | "pending";
}

interface TasksCardProps {
  tasks: Task[];
}

export const TasksCard = ({ tasks: initialTasks }: TasksCardProps) => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "done" ? "pending" : "done";
          toast.success(`Task marked as ${newStatus === "done" ? "completed" : "pending"}`);
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <Card className="card-hover h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Items to be Converted
          </span>
          <span className="text-sm text-muted-foreground font-normal">
            {completedCount}/{tasks.length}
          </span>
        </CardTitle>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks available</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={cn(
                  "flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                  task.status === "done"
                    ? "bg-accent/50 border-[hsl(var(--status-done))] hover:bg-accent"
                    : "border-border hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  {task.status === "done" ? (
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--status-done))] flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-[hsl(var(--status-pending))] flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium transition-all",
                      task.status === "done" && "line-through text-muted-foreground"
                    )}
                  >
                    {task.name}
                  </span>
                </div>
                <StatusBadge variant={task.status}>
                  {task.status === "done" ? "Done" : "Pending"}
                </StatusBadge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
