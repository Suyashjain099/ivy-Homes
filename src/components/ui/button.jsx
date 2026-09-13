import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 hover:shadow-emerald-500/40",
        primary: "btn-primary",
        gold: "btn-gold",
        secondary: "btn-secondary",
        destructive: "btn-danger",
        outline: "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/60 hover:border-slate-500",
        ghost: "bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-12 px-8 text-base rounded-2xl",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
