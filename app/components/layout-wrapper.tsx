"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: ReactNode
  isSidebarCollapsed: boolean
}

export default function LayoutWrapper({ children, isSidebarCollapsed }: LayoutWrapperProps) {
  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        "pt-4 px-6", // Padding for content
        isSidebarCollapsed ? "ml-16" : "ml-64", // Margin based on sidebar width
        "md:pt-6 md:px-8" // Larger padding on medium screens
      )}
    >
      {children}
    </main>
  )
}
