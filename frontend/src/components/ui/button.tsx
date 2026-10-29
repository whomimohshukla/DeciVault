import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#f5c542] via-[#f0b728] to-[#e7a21b] text-[#1d1a17] shadow-[0_12px_24px_rgba(245,197,66,0.28)] hover:brightness-105",
        primary: "bg-gradient-to-r from-[#f5c542] via-[#f0b728] to-[#e7a21b] text-[#1d1a17] shadow-[0_12px_24px_rgba(245,197,66,0.28)] hover:brightness-105",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        warning: "bg-amber-500 text-white shadow-sm hover:bg-amber-600",
        info: "bg-sky-500 text-white shadow-sm hover:bg-sky-600",
        success: "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600",
        gray: "bg-slate-200 text-slate-900 shadow-sm hover:bg-slate-300",
        outline: "border border-input bg-background/80 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-12 rounded-full px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, type, ...props }, ref) => {
    const hasSingleElementChild = React.Children.count(children) === 1 && React.isValidElement(children)
    const shouldUseSlot = asChild && hasSingleElementChild
    const Comp = shouldUseSlot ? Slot : "button"

    const content = (
      <>
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!shouldUseSlot && children}
      </>
    )

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        type={shouldUseSlot ? undefined : (type ?? "button")}
        {...props}
      >
        {shouldUseSlot ? children : content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
