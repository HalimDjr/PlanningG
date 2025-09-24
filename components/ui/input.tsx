import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-0 file:border-0 file:bg-transparent focus-visible:bg-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 select-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 focus-within:no-underline",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
