
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LabelType } from "@/types/todo";
import { Badge } from "@/components/ui/badge";

interface AddLabelDialogProps {
  onAddLabel: (label: Omit<LabelType, "id">) => void;
}

export function AddLabelDialog({ onAddLabel }: AddLabelDialogProps) {
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState({
    name: "",
    color: "bg-gray-200"
  });
  
  const colorOptions = [
    { name: "Gray", value: "bg-gray-200" },
    { name: "Red", value: "bg-red-200" },
    { name: "Orange", value: "bg-orange-200" },
    { name: "Yellow", value: "bg-yellow-200" },
    { name: "Green", value: "bg-green-200" },
    { name: "Blue", value: "bg-blue-200" },
    { name: "Indigo", value: "bg-indigo-200" },
    { name: "Purple", value: "bg-purple-200" },
    { name: "Pink", value: "bg-pink-200" }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.name.trim()) return;
    
    onAddLabel({
      name: newLabel.name,
      color: newLabel.color
    });
    
    setNewLabel({
      name: "",
      color: "bg-gray-200"
    });
    
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Label
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Label</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Label Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={newLabel.name}
              onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
              placeholder="Enter label name"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Choose a Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <Badge
                  key={color.value}
                  className={`cursor-pointer ${color.value} ${newLabel.color === color.value ? "ring-2 ring-offset-2" : "opacity-60"}`}
                  onClick={() => setNewLabel({...newLabel, color: color.value})}
                >
                  {color.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <label className="text-sm font-medium mb-1 block">
              Preview
            </label>
            <Badge className={`${newLabel.color}`}>
              {newLabel.name || "Label Preview"}
            </Badge>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Label
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
