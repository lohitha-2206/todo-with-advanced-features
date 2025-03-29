
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { TaskList } from "@/components/TaskList";
import { TaskType, LabelType } from "@/types/todo";
import { fetchTasks, addTask, updateTask, deleteTask, fetchLabels, addLabel } from "@/services/supabaseService";
import { signOut } from "@/services/authService";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Query tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });
  
  // Query labels
  const { data: labels = [], isLoading: labelsLoading } = useQuery({
    queryKey: ['labels'],
    queryFn: fetchLabels
  });
  
  // Mutations
  const addTaskMutation = useMutation({
    mutationFn: (task: Omit<TaskType, "id" | "completed">) => addTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add task");
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<TaskType> }) => updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update task");
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete task");
    }
  });
  
  const addLabelMutation = useMutation({
    mutationFn: (label: Omit<LabelType, "id">) => addLabel(label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast.success("Label added successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add label");
    }
  });
  
  const handleAddTask = (task: Omit<TaskType, "id" | "completed">) => {
    addTaskMutation.mutate(task);
  };
  
  const handleCompleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTaskMutation.mutate({
        id,
        task: { completed: !task.completed }
      });
    }
  };
  
  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };
  
  const handleUpdateTask = (id: string, updatedTask: Partial<TaskType>) => {
    updateTaskMutation.mutate({ id, task: updatedTask });
  };
  
  const handleAddLabel = (label: Omit<LabelType, "id">) => {
    addLabelMutation.mutate(label);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };
  
  if (tasksLoading || labelsLoading) {
    return <div className="flex items-center justify-center h-screen">Loading tasks...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAddLabel={handleAddLabel} onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">My Tasks</h2>
          <AddTaskDialog onAddTask={handleAddTask} labels={labels} />
        </div>
        
        <FilterBar
          labels={labels}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        
        <TaskList
          tasks={tasks}
          labels={labels}
          activeFilter={activeFilter}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
      </main>
      
      <footer className="py-4 text-center text-muted-foreground text-sm border-t">
        <p>Master Plan &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
