"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useIsMac, getModifierKey } from "@/lib/os-utils";

interface KbdProps extends React.HTMLAttributes<HTMLDivElement> {
  keys: string[];
}

export function Kbd({ keys, className, ...props }: KbdProps) {
  const isMac = useIsMac();
  
  return (
    <div className={cn("flex items-center gap-0.5", className)} {...props}>
      {keys.map((key, index) => {
        let displayKey = key;
        if (key.toLowerCase() === "mod") {
          displayKey = getModifierKey(isMac);
        } else if (key.toLowerCase() === "shift") {
          displayKey = isMac ? "⇧" : "Shift";
        } else if (key.toLowerCase() === "alt") {
          displayKey = isMac ? "⌥" : "Alt";
        }
        
        return (
          <kbd
            key={index}
            className={cn(
              "inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-zinc-50 border-zinc-200 px-1.5 font-mono text-[10px] font-medium text-zinc-500 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
            )}
          >
            {displayKey}
          </kbd>
        );
      })}
    </div>
  );
}
