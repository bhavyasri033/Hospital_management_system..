"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, Settings, User, Shield, Stethoscope, Pill } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TopNavbarProps {
  user: {
    id: string
    name: string
    email: string
    role: "admin" | "doctor" | "pharma"
  }
  onLogout: () => void
}

export default function TopNavbar({ user, onLogout }: TopNavbarProps) {
  const router = useRouter();

  const getRoleInfo = () => {
    switch (user.role) {
      case "admin":
        return {
          label: "Administrator",
          icon: Shield,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          description: "Full system access",
        }
      case "doctor":
        return {
          label: "Doctor",
          icon: Stethoscope,
          color: "text-green-600",
          bgColor: "bg-green-100",
          description: "Patient care specialist",
        }
      case "pharma":
        return {
          label: "Pharmaceutical Admin",
          icon: Pill,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          description: "Inventory management",
        }
      default:
        return {
          label: "User",
          icon: User,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          description: "Standard access",
        }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const roleInfo = getRoleInfo()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{roleInfo.label} Dashboard</h1>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              <Badge className={`${roleInfo.bgColor} ${roleInfo.color} border-0 text-xs`}>{roleInfo.description}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Enhanced Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 p-3 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
              3
            </span>
          </Button>

          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-gray-100">
                <Avatar className="h-12 w-12 border-2 border-gray-200">
                  <AvatarFallback className={`${roleInfo.bgColor} ${roleInfo.color} font-bold text-lg`}>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <Badge className={`${roleInfo.bgColor} ${roleInfo.color} border-0 text-xs w-fit`}>
                    {roleInfo.label}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
