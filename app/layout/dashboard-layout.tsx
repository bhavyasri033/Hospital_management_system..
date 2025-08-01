"use client"

import { useState } from "react"
import AnimatedSidebar from "@/app/components/animated-sidebar"
import LayoutWrapper from "@/app/components/layout-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // You can get the actual user role from your auth system
  const userRole = "admin"

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AnimatedSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole={userRole}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <LayoutWrapper isSidebarCollapsed={isSidebarCollapsed}>
        {children}
      </LayoutWrapper>
    </div>
  )
}
