
import { Button } from "@/components/ui/button";
import { LabelType } from "@/types/todo";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  labels: LabelType[];
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
}

export function FilterBar({ labels, activeFilter, setActiveFilter }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 animate-slide-in">
      <Button
        variant={activeFilter === null ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter(null)}
        className="rounded-full"
      >
        All
      </Button>
      
      <Button
        variant={activeFilter === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter("active")}
        className="rounded-full"
      >
        Active
      </Button>
      
      <Button
        variant={activeFilter === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter("completed")}
        className="rounded-full"
      >
        Completed
      </Button>
      
      {labels.map(label => (
        <Badge
          key={label.id}
          className={`cursor-pointer px-3 py-1 text-sm ${label.color} ${activeFilter === label.id ? "ring-2 ring-offset-2" : "opacity-70 hover:opacity-100"}`}
          onClick={() => setActiveFilter(label.id)}
        >
          {label.name}
        </Badge>
      ))}
    </div>
  );
}
