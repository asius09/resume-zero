import React from "react";
import { GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface CollapsibleCardProps {
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: (e: React.MouseEvent) => void;
  title: string;
  subtitle?: string;
  metadata?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Reusable collapsible card component with expand/collapse functionality
 * Used for experience, education, and other list-based sections
 */
export function CollapsibleCard({
  isExpanded,
  onToggle,
  onRemove,
  title,
  subtitle,
  metadata,
  children,
}: CollapsibleCardProps) {
  // Validate required props
  if (!title && !subtitle) {
    console.warn("CollapsibleCard: Both title and subtitle are empty");
  }

  const handleToggle = () => {
    try {
      onToggle();
    } catch (error) {
      console.error("Error toggling card:", error);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      onRemove(e);
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };
  return (
    <Card
      className={cn(
        "group/item border-zinc-200 shadow-sm transition-all duration-200 overflow-hidden",
        isExpanded ? "ring-1 ring-zinc-900 border-zinc-900" : "hover:border-zinc-300"
      )}
    >
      {/* Header / Summary View */}
      <div 
        className={cn(
          "p-4 flex items-center gap-3 sm:gap-4 cursor-pointer select-none",
          isExpanded ? "bg-zinc-50/50 border-b border-zinc-100" : "bg-white"
        )}
        onClick={handleToggle}
      >
        <div className="text-zinc-300 group-hover/item:text-zinc-500 transition-colors hidden sm:block">
          <GripVertical size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className={cn(
              "font-semibold truncate text-sm sm:text-base",
              !title && "text-zinc-400 italic"
            )}>
              {title || "Untitled"}
            </span>
            {subtitle && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-zinc-300 hidden sm:inline">•</span>
                <span className="text-zinc-600 truncate text-xs sm:text-sm">{subtitle}</span>
              </div>
            )}
          </div>
          {!isExpanded && metadata && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 text-[10px] sm:text-xs text-zinc-500">
              {metadata}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </Button>
          <div className="text-zinc-400 ml-1">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
