import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToggleButtonGroupProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: string[];
}

export const ToggleButtonGroup = ({ label, value, onChange, options }: ToggleButtonGroupProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={value === option ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option)}
            className={cn("capitalize transition-all", value === option && "shadow-md")}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
