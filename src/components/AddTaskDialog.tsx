
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LabelType, TaskType } from "@/types/todo";

interface AddTaskDialogProps {
  onAddTask: (task: Omit<TaskType, "id" | "completed">) => void;
  labels: LabelType[];
}

export function AddTaskDialog({ onAddTask, labels }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    labelIds: [] as string[]
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    onAddTask({
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || undefined,
      labelIds: newTask.labelIds
    });
    
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      labelIds: []
    });
    
    setOpen(false);
  };
  
  const toggleLabel = (labelId: string) => {
    setNewTask(prev => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter(id => id !== labelId)
        : [...prev.labelIds, labelId]
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-todoAccent hover:bg-todoSecondary">
          <Plus className="h-5 w-5 mr-1" /> Add Task
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Task description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Due Date
            </label>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Labels
            </label>
            <div className="flex flex-wrap gap-2">
              {labels.map(label => (
                <Badge
                  key={label.id}
                  className={`cursor-pointer ${label.color} ${newTask.labelIds.includes(label.id) ? "ring-2 ring-offset-2" : "opacity-60"}`}
                  onClick={() => toggleLabel(label.id)}
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
