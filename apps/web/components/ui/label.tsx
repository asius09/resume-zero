import * as React from "react";
import { cn } from "@/lib/cn";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-500 uppercase tracking-widest mb-1.5 block",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
