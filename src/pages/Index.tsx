
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { TaskList } from "@/components/TaskList";
import { TaskType, LabelType } from "@/types/todo";

// Generate initial sample data
const initialLabels: LabelType[] = [
  { id: "label-1", name: "Work", color: "bg-blue-200" },
  { id: "label-2", name: "Personal", color: "bg-green-200" },
  { id: "label-3", name: "Urgent", color: "bg-red-200" },
  { id: "label-4", name: "Low Priority", color: "bg-yellow-200" }
];

const initialTasks: TaskType[] = [
  {
    id: "task-1",
    title: "Create project presentation",
    description: "Prepare slides for the quarterly review meeting",
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    labelIds: ["label-1", "label-3"]
  },
  {
    id: "task-2",
    title: "Grocery shopping",
    description: "Buy fruits, vegetables, and snacks for the week",
    completed: false,
    labelIds: ["label-2"]
  },
  {
    id: "task-3",
    title: "Read book chapter",
    description: "Complete chapter 5 of 'Atomic Habits'",
    completed: true,
    labelIds: ["label-2", "label-4"]
  }
];

const Index = () => {
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [labels, setLabels] = useState<LabelType[]>(() => {
    const savedLabels = localStorage.getItem("labels");
    return savedLabels ? JSON.parse(savedLabels) : initialLabels;
  });
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Save to localStorage whenever tasks or labels change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem("labels", JSON.stringify(labels));
  }, [labels]);
  
  const handleAddTask = (task: Omit<TaskType, "id" | "completed">) => {
    const newTask: TaskType = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast.success("Task added successfully");
  };
  
  const handleCompleteTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    const completedTask = tasks.find(task => task.id === id);
    const action = completedTask?.completed ? "uncompleted" : "completed";
    toast.success(`Task marked as ${action}`);
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully");
  };
  
  const handleUpdateTask = (id: string, updatedTask: Partial<TaskType>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updatedTask } 
          : task
      )
    );
    toast.success("Task updated successfully");
  };
  
  const handleAddLabel = (label: Omit<LabelType, "id">) => {
    const newLabel: LabelType = {
      ...label,
      id: `label-${Date.now()}`
    };
    
    setLabels(prev => [...prev, newLabel]);
    toast.success("Label added successfully");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAddLabel={handleAddLabel} />
      
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
