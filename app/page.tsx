"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hospital, UserPlus, LogIn, Shield, Stethoscope, Pill } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "pharma"
}

export default function AuthPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerRole, setRegisterRole] = useState<"admin" | "doctor" | "pharma">("doctor")

  // Mock users for demo
  const mockUsers = [
    { id: "1", name: "Dr. Sarah Johnson", email: "doctor@hospital.com", role: "doctor" as const },
    { id: "2", name: "Admin User", email: "admin@hospital.com", role: "admin" as const },
    { id: "3", name: "Pharma Manager", email: "pharma@hospital.com", role: "pharma" as const },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = mockUsers.find((u) => u.email === loginEmail)
    if (user) {
      setCurrentUser(user)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: Date.now().toString(),
      name: registerName,
      email: registerEmail,
      role: registerRole,
    }
    setCurrentUser(newUser)
  }

  if (currentUser) {
    if (currentUser.role === "admin") {
      return <AdminDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
    } else if (currentUser.role === "doctor") {
      return <DoctorDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
    } else {
      return <PharmaDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Hospital className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              MediCare HMS
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">Advanced Healthcare Management System</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-gray-300">
                  <UserPlus className="h-4 w-4" />
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                  >
                    Sign In to Dashboard
                  </Button>
                </form>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Demo Accounts
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Shield className="h-3 w-3" />
                      <span className="font-medium">Admin:</span> admin@hospital.com
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Stethoscope className="h-3 w-3" />
                      <span className="font-medium">Doctor:</span> doctor@hospital.com
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Pill className="h-3 w-3" />
                      <span className="font-medium">Pharma:</span> pharma@hospital.com
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-gray-700 dark:text-gray-300 font-medium">
                      Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300 font-medium">
                      Role
                    </Label>
                    <Select
                      value={registerRole}
                      onValueChange={(value: "admin" | "doctor" | "pharma") => setRegisterRole(value)}
                    >
                      <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem value="doctor" className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Stethoscope className="h-4 w-4" />
                          Doctor
                        </SelectItem>
                        <SelectItem value="admin" className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Shield className="h-4 w-4" />
                          Administrator
                        </SelectItem>
                        <SelectItem value="pharma" className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Pill className="h-4 w-4" />
                          Pharmaceutical Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Import dashboard components
import AdminDashboard from "./components/admin-dashboard"
import DoctorDashboard from "./components/doctor-dashboard"
import PharmaDashboard from "./components/pharma-dashboard"
