"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  UserCheck,
  Calendar,
  Package,
  DollarSign,
  Bed,
  Activity,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  IndianRupee,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts"
import AnimatedSidebar from "./animated-sidebar"
import AnimatedTopNavbar from "./animated-top-navbar"
import AnimatedCard from "./animated-card"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "pharma"
}

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)

  // Mock data with enhanced visuals
  const summaryData = [
    {
      title: "Total Patients",
      value: "2,847",
      icon: Users,
      change: "+12%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up",
    },
    {
      title: "Active Doctors",
      value: "156",
      icon: UserCheck,
      change: "+3%",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "up",
    },
    {
      title: "Today's Appointments",
      value: "89",
      icon: Calendar,
      change: "+8%",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up",
    },
    {
      title: "Inventory Items",
      value: "5,678",
      icon: Package,
      change: "-2%",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "down",
    },
    {
      title: "Monthly Revenue",
      value: "₹125,430",
      icon: IndianRupee,
      change: "+15%",
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up",
    },
    {
      title: "Available Beds",
      value: "89",
      icon: Bed,
      change: "-5%",
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "down",
    },
  ]

  const bedOccupancyData = [
    { name: "Occupied", value: 156, color: "#ef4444" },
    { name: "Available", value: 89, color: "#22c55e" },
  ]

  const revenueData = [
    { month: "Jan", revenue: 85000, patients: 2400 },
    { month: "Feb", revenue: 92000, patients: 2600 },
    { month: "Mar", revenue: 78000, patients: 2200 },
    { month: "Apr", revenue: 105000, patients: 2800 },
    { month: "May", revenue: 118000, patients: 3100 },
    { month: "Jun", revenue: 125430, patients: 3200 },
  ]

  const activityFeed = [
    {
      id: "1",
      type: "appointment",
      message: "New appointment scheduled",
      time: "2 minutes ago",
      details: "Dr. Smith with Patient John Doe at 3:00 PM",
      priority: "normal",
      icon: Calendar,
    },
    {
      id: "2",
      type: "admission",
      message: "Emergency admission to ICU",
      time: "15 minutes ago",
      details: "Critical patient admitted - Room 204, requires immediate attention",
      priority: "high",
      icon: AlertTriangle,
    },
    {
      id: "3",
      type: "discharge",
      message: "Patient discharged successfully",
      time: "1 hour ago",
      details: "Recovery complete - Room 156, Follow-up scheduled in 2 weeks",
      priority: "normal",
      icon: Users,
    },
    {
      id: "4",
      type: "inventory",
      message: "Critical stock alert",
      time: "2 hours ago",
      details: "Paracetamol tablets - Only 50 units remaining, reorder required",
      priority: "high",
      icon: Package,
    },
  ]

  const upcomingAppointments = [
    {
      id: "1",
      patient: "John Doe",
      doctor: "Dr. Smith",
      time: "09:00 AM",
      status: "confirmed",
      department: "Cardiology",
    },
    {
      id: "2",
      patient: "Jane Wilson",
      doctor: "Dr. Johnson",
      time: "10:30 AM",
      status: "pending",
      department: "Neurology",
    },
    {
      id: "3",
      patient: "Mike Brown",
      doctor: "Dr. Davis",
      time: "02:00 PM",
      status: "confirmed",
      department: "Pediatrics",
    },
    {
      id: "4",
      patient: "Sarah Lee",
      doctor: "Dr. Wilson",
      time: "03:30 PM",
      status: "cancelled",
      department: "Orthopedics",
    },
  ]

  const wardsData = [
    { ward: "ICU", totalBeds: 20, occupied: 18, available: 2, occupancy: 90 },
    { ward: "General Ward A", totalBeds: 50, occupied: 35, available: 15, occupancy: 70 },
    { ward: "General Ward B", totalBeds: 50, occupied: 42, available: 8, occupancy: 84 },
    { ward: "Pediatric", totalBeds: 30, occupied: 22, available: 8, occupancy: 73 },
    { ward: "Maternity", totalBeds: 25, occupied: 19, available: 6, occupancy: 76 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "normal":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-700"
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {summaryData.map((item, index) => (
          <AnimatedCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            change={item.change}
            color={item.color}
            bgColor={item.bgColor}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Enhanced Activity Feed */}
        <Card className="lg:col-span-1 border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Live Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {activityFeed.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    "border-l-4 p-4 border-b last:border-b-0 transition-colors stagger-item",
                    getPriorityColor(activity.priority),
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${activity.priority === "high" ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
                      >
                        <activity.icon
                          className={`h-4 w-4 ${activity.priority === "high" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{activity.message}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {expandedActivity === activity.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {expandedActivity === activity.id && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{activity.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Charts */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b dark:from-red-900/20 dark:to-pink-900/20 dark:border-gray-700">
                <CardTitle className="text-gray-800 dark:text-white text-base sm:text-lg">Bed Occupancy</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="w-full h-[200px] sm:h-[220px] flex items-center justify-center">
                  <ChartContainer
                    config={{
                      occupied: { label: "Occupied", color: "#ef4444" },
                      available: { label: "Available", color: "#22c55e" },
                    }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bedOccupancyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          dataKey="value"
                          label={({ name, percent = 0 }: { name?: string; percent?: number }) => `${name || ''} ${(percent * 100).toFixed(0)}%`}
                        >
                          {bedOccupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b dark:from-green-900/20 dark:to-emerald-900/20 dark:border-gray-700">
                <CardTitle className="text-gray-800 dark:text-white text-base sm:text-lg">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <div className="w-full h-[200px] sm:h-[220px] flex items-center justify-center">
                  <ChartContainer
                    config={{
                      revenue: { label: "Revenue", color: "#10b981" },
                    }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Enhanced Appointments Table */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b dark:from-purple-900/20 dark:to-indigo-900/20 dark:border-gray-700">
            <CardTitle className="text-gray-800 dark:text-white">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Patient</TableHead>
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Doctor</TableHead>
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Time</TableHead>
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="table-row dark:hover:bg-gray-700">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{appointment.patient}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.department}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{appointment.doctor}</TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{appointment.time}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(appointment.status)} border text-xs`}>{appointment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Ward Status */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b dark:from-orange-900/20 dark:to-yellow-900/20 dark:border-gray-700">
            <CardTitle className="text-gray-800 dark:text-white">Ward Occupancy Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Ward</TableHead>
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Occupancy</TableHead>
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Available</TableHead>
                    <TableHead className="font-semibold dark:text-gray-300 text-xs sm:text-sm">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wardsData.map((ward, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
                      <TableCell className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{ward.ward}</TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium dark:text-red-400 text-xs sm:text-sm">{ward.occupied}</span>
                        <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">/{ward.totalBeds}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium dark:text-green-400 text-xs sm:text-sm">{ward.available}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                            <div
                              className={`h-2 rounded-full ${ward.occupancy > 85 ? "bg-red-500" : ward.occupancy > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${ward.occupancy}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{ward.occupancy}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AnimatedSidebar currentPage={currentPage} onPageChange={setCurrentPage} userRole="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatedTopNavbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6 page-enter dark:bg-gray-900">
          {currentPage === "dashboard" && renderDashboard()}
          {currentPage === "patients" && <PatientsPage />}
          {currentPage === "doctors" && <DoctorsPage />}
          {currentPage === "appointments" && <AppointmentsPage userRole="admin" />}
          {currentPage === "inventory" && <InventoryPage userRole="admin" />}
          {currentPage === "beds" && <BedManagementPage />}
          {currentPage === "reports" && <ReportsPage />}
        </main>
      </div>
    </div>
  )
}

// Import management pages
import PatientsPage from "./patients-page"
import DoctorsPage from "./doctors-page"
import AppointmentsPage from "./appointments-page"
import InventoryPage from "./inventory-page"
import BedManagementPage from "./bed-management-page"
import ReportsPage from "./reports-page"
