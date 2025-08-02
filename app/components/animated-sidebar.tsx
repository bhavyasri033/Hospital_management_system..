"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "admin" | "doctor" | "pharma"
}

export default function AnimatedSidebar({ currentPage, onPageChange, userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const autoCollapseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-collapse after 3 seconds of inactivity
  const AUTO_COLLAPSE_DELAY = 3000
  // Hover delay before expanding
  const HOVER_EXPAND_DELAY = 300

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Start auto-collapse timer when component mounts (desktop only)
    if (!isMobile) {
      startAutoCollapseTimer()
    }

    return () => {
      clearTimers()
      window.removeEventListener('resize', checkMobile)
    }
  }, [isMobile])

  const clearTimers = () => {
    if (autoCollapseTimerRef.current) {
      clearTimeout(autoCollapseTimerRef.current)
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
  }

  const startAutoCollapseTimer = () => {
    if (isMobile) return
    clearTimers()
    autoCollapseTimerRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsCollapsed(true)
      }
    }, AUTO_COLLAPSE_DELAY)
  }

  const handleMouseEnter = () => {
    if (isMobile) return
    setIsHovered(true)
    clearTimers()
    
    // Expand after a short delay
    hoverTimerRef.current = setTimeout(() => {
      setIsCollapsed(false)
    }, HOVER_EXPAND_DELAY)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    setIsHovered(false)
    clearTimers()
    
    // Collapse after a short delay
    hoverTimerRef.current = setTimeout(() => {
      setIsCollapsed(true)
    }, HOVER_EXPAND_DELAY)
  }

  const handleManualToggle = () => {
    setIsCollapsed(!isCollapsed)
    if (!isMobile) {
      startAutoCollapseTimer()
    }
  }

  const handlePageChange = (page: string) => {
    onPageChange(page)
    if (!isMobile) {
      startAutoCollapseTimer()
    }
  }

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

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
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
          {!isMobile && (
            <Button variant="ghost" size="sm" onClick={handleManualToggle} className="btn-animate p-2">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
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
              onClick={() => handlePageChange(item.id)}
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

  // Mobile: Return Sheet (drawer)
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Return regular sidebar
  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col dark:bg-gray-900 dark:border-gray-700 relative hidden md:flex",
        isCollapsed ? "w-16" : "w-64",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderSidebarContent()}
    </div>
  )
}
