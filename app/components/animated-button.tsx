"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export default function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
  disabled = false,
  loading = false,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("btn-animate ripple", className)}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="loading-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}
