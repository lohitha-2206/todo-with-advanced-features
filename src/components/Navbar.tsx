
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddLabelDialog } from "@/components/AddLabelDialog";
import { LabelType } from "@/types/todo";

interface NavbarProps {
  onAddLabel: (label: Omit<LabelType, "id">) => void;
}

export function Navbar({ onAddLabel }: NavbarProps) {
  return (
    <header className="border-b py-4 px-6 bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-todoAccent to-todoSecondary bg-clip-text text-transparent">
            Master Plan
          </h1>
          <span className="text-xs bg-todoAccent px-2 py-1 rounded-full text-white">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <AddLabelDialog onAddLabel={onAddLabel} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
