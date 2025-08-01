"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  color: string
  bgColor: string
  description?: string
  children?: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedCard({
  title,
  value,
  icon: Icon,
  change,
  color,
  bgColor,
  description,
  children,
  className,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <Card
      className={cn("relative overflow-hidden border-0 shadow-lg card-hover animate-scale-in", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Animated Background */}
      <div className={cn("absolute inset-0 opacity-50", bgColor)}></div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-white animate-fade-in">{title}</CardTitle>
          {description && (
            <p className="text-xs text-gray-500 mt-1 animate-slide-up dark:text-gray-300" style={{ animationDelay: "0.2s" }}>
              {description}
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl icon-hover float", bgColor)} style={{ animationDelay: "0.3s" }}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          {value}
        </div>
        {change && (
          <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <span className={cn("text-sm font-medium", change.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
              {change}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-300">from last period</span>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
