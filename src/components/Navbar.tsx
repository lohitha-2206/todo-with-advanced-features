
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddLabelDialog } from "@/components/AddLabelDialog";
import { LabelType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface NavbarProps {
  onAddLabel: (label: Omit<LabelType, "id">) => void;
  onLogout: () => void;
}

export function Navbar({ onAddLabel, onLogout }: NavbarProps) {
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
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
