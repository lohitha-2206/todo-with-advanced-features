
import { useState } from "react";
import { Check, Clock, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskType, LabelType } from "@/types/todo";

interface TaskCardProps {
  task: TaskType;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedTask: Partial<TaskType>) => void;
  labels: LabelType[];
}

export function TaskCard({ task, onComplete, onDelete, onUpdate, labels }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };
  
  const getLabelColor = (labelId: string) => {
    const label = labels.find(l => l.id === labelId);
    return label?.color || "bg-gray-200";
  };
  
  const getLabelName = (labelId: string) => {
    const label = labels.find(l => l.id === labelId);
    return label?.name || "";
  };
  
  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };
  
  return (
    <>
      <div className={`todo-card animate-fade-in ${task.completed ? "opacity-60" : ""}`}>
        {task.completed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labelIds.map(labelId => (
            <Badge
              key={labelId}
              className={`${getLabelColor(labelId)} text-foreground`}
            >
              {getLabelName(labelId)}
            </Badge>
          ))}
        </div>
        
        <h3 className={`font-medium text-lg mb-1 ${task.completed ? "line-through" : ""}`}>
          {task.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
        
        {task.dueDate && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        
        <div className="flex justify-between mt-auto pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComplete(task.id)}
            className="hover:text-green-500"
          >
            <Check className="h-4 w-4 mr-1" />
            {task.completed ? "Undo" : "Complete"}
          </Button>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="hover:text-blue-500"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Title
              </label>
              <Input
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                placeholder="Task title"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <Textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
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
                value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
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
                    className={`cursor-pointer ${getLabelColor(label.id)} ${editedTask.labelIds.includes(label.id) ? "ring-2 ring-offset-2" : "opacity-60"}`}
                    onClick={() => {
                      const newLabelIds = editedTask.labelIds.includes(label.id)
                        ? editedTask.labelIds.filter(id => id !== label.id)
                        : [...editedTask.labelIds, label.id];
                      setEditedTask({...editedTask, labelIds: newLabelIds});
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
