
import { TaskType, LabelType } from "@/types/todo";
import { TaskCard } from "@/components/TaskCard";

interface TaskListProps {
  tasks: TaskType[];
  labels: LabelType[];
  activeFilter: string | null;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTask: Partial<TaskType>) => void;
}

export function TaskList({ 
  tasks, 
  labels, 
  activeFilter, 
  onComplete, 
  onDelete, 
  onUpdate 
}: TaskListProps) {
  
  const filteredTasks = tasks.filter(task => {
    if (!activeFilter) return true;
    if (activeFilter === "completed") return task.completed;
    if (activeFilter === "active") return !task.completed;
    return task.labelIds.includes(activeFilter);
  });
  
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground animate-fade-in">
        <p className="text-lg">No tasks found</p>
        <p className="text-sm">Try adding a new task or changing filters</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          labels={labels}
          onComplete={onComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
