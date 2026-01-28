import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useToast } from "@/hooks/use-toast";

interface EditorAddButtonProps {
  onClick: () => void;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  toastTitle?: string;
  toastDescription?: string;
}

export function EditorAddButton({
  onClick,
  label,
  variant = "primary",
  className,
  toastTitle,
  toastDescription,
}: EditorAddButtonProps) {
  const { toast } = useToast();
  const isPrimary = variant === "primary";

  const handleClick = () => {
    onClick();
    if (toastTitle) {
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "success",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group relative flex items-center justify-center gap-2.5 transition-all duration-300 select-none cursor-pointer",
        isPrimary
          ? "w-full py-3.5 border border-dashed border-zinc-200 rounded-lg hover:border-zinc-300 bg-zinc-50/20 hover:bg-zinc-50/50"
          : "w-fit py-1.5 px-3 border border-dashed border-zinc-200 rounded-md hover:border-zinc-400 bg-transparent",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          isPrimary 
            ? "w-5 h-5 bg-white border border-zinc-100 rounded-full shadow-xs group-hover:scale-110 group-active:scale-90" 
            : "group-hover:rotate-90"
        )}
      >
        <Plus
          size={isPrimary ? 12 : 10}
          className="text-zinc-400 group-hover:text-zinc-900 transition-colors"
          strokeWidth={3}
        />
      </div>
      <span
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider transition-colors",
          "text-zinc-400 group-hover:text-zinc-900"
        )}
      >
        {label}
      </span>
    </button>
  );
}
