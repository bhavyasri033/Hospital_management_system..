"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Package,
  Bed,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "admin" | "doctor" | "pharma"
}

export default function AnimatedSidebar({ currentPage, onPageChange, userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "doctor", "pharma"],
    },
    {
      id: "patients",
      label: "Patients",
      icon: Users,
      roles: ["admin", "doctor"],
      badge: "247",
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: UserCheck,
      roles: ["admin"],
      badge: "156",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      roles: ["admin", "doctor"],
      badge: "89",
    },
    {
      id: "beds",
      label: "Bed Management",
      icon: Bed,
      roles: ["admin"],
      badge: "New",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      roles: ["admin", "pharma"],
      badge: "5.6K",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      roles: ["admin"],
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "doctor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pharma":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col dark:bg-gray-900 dark:border-gray-700",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">HMS</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hospital Management</p>
                </div>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="btn-animate p-2">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Role Badge */}
      {!isCollapsed && (
        <div className="p-4 animate-slide-down">
          <Badge className={cn("w-full justify-center border animate-scale-in", getRoleBadgeColor(userRole))}>
            <Activity className="h-3 w-3 mr-1" />
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start sidebar-item stagger-item",
                isActive && "bg-blue-50 text-blue-700 border-l-4 border-blue-600",
                isCollapsed ? "px-2" : "px-4",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className={cn("h-5 w-5 icon-hover", isCollapsed ? "mx-auto" : "mr-3")} />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full animate-fade-in">
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs animate-bounce"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-center animate-fade-in">
            <p className="text-xs text-gray-500">Version 2.1.0</p>
            <p className="text-xs text-gray-400">© 2024 HMS</p>
          </div>
        )}
      </div>
    </div>
  )
}
