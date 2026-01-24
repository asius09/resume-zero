import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-zinc-900 text-white hover:bg-black shadow-md active:scale-[0.98]",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-[0.98]",
      outline:
        "border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98]",
      ghost: "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-8 px-3 text-[10px] font-bold uppercase tracking-widest",
      md: "h-10 px-4 text-xs font-bold uppercase tracking-widest",
      lg: "h-12 px-8 text-sm font-bold uppercase tracking-widest",
      icon: "h-9 w-9 p-0 flex items-center justify-center",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
