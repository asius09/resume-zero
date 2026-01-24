import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface EditorAddButtonProps {
  onClick: () => void;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function EditorAddButton({ 
  onClick, 
  label, 
  variant = "primary",
  className 
}: EditorAddButtonProps) {
  if (variant === "secondary") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className={cn(
          'mt-2', 
          'w-full', 
          'md:w-fit', 
          'border-dashed', 
          'border-zinc-200', 
          'text-zinc-500', 
          'hover:text-zinc-900', 
          'hover:border-zinc-900', 
          'hover:bg-white', 
          'transition-all', 
          'h-10', 
          'rounded-lg',
          className
        )}
      >
        <Plus size={14} className={cn('mr-2')} /> {label}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className={cn(
        'w-full', 
        'border-dashed', 
        'border-zinc-300', 
        'text-zinc-500', 
        'hover:text-zinc-900', 
        'hover:border-zinc-900', 
        'hover:bg-zinc-50', 
        'py-8', 
        'text-sm', 
        'font-medium', 
        'transition-all', 
        'rounded-xl',
        className
      )}
      onClick={onClick}
    >
      <Plus size={16} className={cn('mr-2')} /> {label}
    </Button>
  );
}
