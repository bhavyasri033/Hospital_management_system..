"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Package,
  Hospital,
  ChevronLeft,
  ChevronRight,
  Shield,
  Stethoscope,
  Pill,
} from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "admin" | "doctor" | "pharma"
}

export default function Sidebar({ currentPage, onPageChange, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setCollapsed(true)
  }, [pathname])

  const getMenuItems = () => {
    const baseItems = [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }]

    if (userRole === "admin") {
      return [
        ...baseItems,
        { id: "patients", label: "Patients", icon: Users },
        { id: "doctors", label: "Doctors", icon: UserCheck },
        { id: "appointments", label: "Appointments", icon: Calendar },
        { id: "inventory", label: "Inventory", icon: Package },
      ]
    } else if (userRole === "doctor") {
      return [
        ...baseItems,
        { id: "patients", label: "Patients", icon: Users },
        { id: "appointments", label: "Appointments", icon: Calendar },
      ]
    } else {
      return [...baseItems, { id: "inventory", label: "Inventory", icon: Package }]
    }
  }

  const getRoleInfo = () => {
    switch (userRole) {
      case "admin":
        return { icon: Shield, label: "Administrator", color: "text-blue-600", bgColor: "bg-blue-50" }
      case "doctor":
        return { icon: Stethoscope, label: "Doctor", color: "text-green-600", bgColor: "bg-green-50" }
      case "pharma":
        return { icon: Pill, label: "Pharmacist", color: "text-purple-600", bgColor: "bg-purple-50" }
      default:
        return { icon: Shield, label: "User", color: "text-gray-600", bgColor: "bg-gray-50" }
    }
  }

  const menuItems = getMenuItems()
  const roleInfo = getRoleInfo()

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  MediCare
                </span>
                <p className="text-xs text-gray-500">Healthcare Management</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className={`mt-4 p-3 rounded-lg ${roleInfo.bgColor} border border-gray-200`}>
            <div className="flex items-center space-x-2">
              <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
              <span className={`text-sm font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-12 text-left font-medium transition-all duration-200",
                  collapsed ? "px-3" : "px-4",
                  currentPage === item.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
                onClick={() => {
                  onPageChange(item.id);
                  setCollapsed(true);
                }}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Enhanced Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-700 font-medium">System Online</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">All services operational</p>
          </div>
        </div>
      )}
    </div>
  )
}
