"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, User, Settings, LogOut, Bell, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import ProfileSettings from "./profile-settings"
import SystemSettings from "./system-settings"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "pharma"
}

interface AnimatedTopNavbarProps {
  user: User
  onLogout: () => void
}

export default function AnimatedTopNavbar({ user, onLogout }: AnimatedTopNavbarProps) {
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false)
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600 dark:text-red-400"
      case "doctor":
        return "text-blue-600 dark:text-blue-400"
      case "pharma":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "doctor":
        return "Doctor"
      case "pharma":
        return "Pharmaceutical Admin"
      default:
        return role
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "🛡️"
      case "doctor":
        return "👨‍⚕️"
      case "pharma":
        return "💊"
      default:
        return "👤"
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section - Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button will be handled by sidebar */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">HMS</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Hospital Management</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, doctors, appointments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications - Mobile optimized */}
            <Button variant="ghost" size="sm" className="btn-animate p-2 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="btn-animate flex items-center space-x-2 px-2 sm:px-3 hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 font-semibold">
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className={cn("text-xs capitalize flex items-center gap-1", getRoleColor(user.role))}>
                      <span>{getRoleIcon(user.role)}</span>
                      {getRoleDisplayName(user.role)}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 modal-content dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuLabel className="dark:text-white">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 font-semibold">
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className={cn("text-xs capitalize flex items-center gap-1 mt-1", getRoleColor(user.role))}>
                          <span>{getRoleIcon(user.role)}</span>
                          {getRoleDisplayName(user.role)}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={() => setIsProfileSettingsOpen(true)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={() => setIsSystemSettingsOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20" 
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileSettings 
        user={user}
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
      />

      {/* System Settings Modal */}
      <SystemSettings 
        isOpen={isSystemSettingsOpen}
        onClose={() => setIsSystemSettingsOpen(false)}
      />
    </>
  )
}
