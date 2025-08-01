"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Heart,
  Activity,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
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

interface DoctorDashboardProps {
  user: User
  onLogout: () => void
}

export default function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedLabResult, setSelectedLabResult] = useState<any>(null)

  // Enhanced mock data
  const summaryData = [
    {
      title: "My Patients",
      value: "127",
      icon: Users,
      change: "+5%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Active patients under care",
    },
    {
      title: "Today's Schedule",
      value: "12",
      icon: Calendar,
      change: "+2",
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Appointments scheduled",
    },
    {
      title: "Critical Cases",
      value: "3",
      icon: AlertTriangle,
      change: "-1",
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Require immediate attention",
    },
    {
      title: "Pending Reports",
      value: "8",
      icon: FileText,
      change: "+3",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Lab results to review",
    },
  ]

  const todaysAppointments = [
    {
      id: "1",
      time: "09:00 AM",
      patient: "John Doe",
      type: "Consultation",
      status: "completed",
      priority: "normal",
      duration: "30 min",
    },
    {
      id: "2",
      time: "10:30 AM",
      patient: "Jane Smith",
      type: "Follow-up",
      status: "in-progress",
      priority: "high",
      duration: "45 min",
    },
    {
      id: "3",
      time: "11:00 AM",
      patient: "Mike Johnson",
      type: "Check-up",
      status: "scheduled",
      priority: "normal",
      duration: "30 min",
    },
    {
      id: "4",
      time: "02:00 PM",
      patient: "Sarah Wilson",
      type: "Consultation",
      status: "scheduled",
      priority: "normal",
      duration: "30 min",
    },
    {
      id: "5",
      time: "03:30 PM",
      patient: "David Brown",
      type: "Follow-up",
      status: "scheduled",
      priority: "high",
      duration: "45 min",
    },
  ]

  const labResults = [
    {
      id: "1",
      patient: "John Doe",
      test: "Complete Blood Count",
      date: "2024-01-15",
      status: "completed",
      priority: "normal",
      results: {
        hemoglobin: "14.2 g/dL",
        whiteBloodCells: "7,200/μL",
        platelets: "250,000/μL",
        glucose: "95 mg/dL",
      },
    },
    {
      id: "2",
      patient: "Jane Smith",
      test: "Chest X-Ray",
      date: "2024-01-14",
      status: "pending",
      priority: "high",
      results: null,
    },
    {
      id: "3",
      patient: "Mike Johnson",
      test: "ECG Analysis",
      date: "2024-01-13",
      status: "completed",
      priority: "normal",
      results: {
        heartRate: "72 bpm",
        rhythm: "Normal sinus rhythm",
        intervals: "Normal",
        interpretation: "Normal ECG",
      },
    },
  ]

  const satisfactionData = [
    { month: "Jan", satisfaction: 4.2, reviews: 45 },
    { month: "Feb", satisfaction: 4.5, reviews: 52 },
    { month: "Mar", satisfaction: 4.3, reviews: 48 },
    { month: "Apr", satisfaction: 4.7, reviews: 61 },
    { month: "May", satisfaction: 4.6, reviews: 58 },
    { month: "Jun", satisfaction: 4.8, reviews: 67 },
  ]

  const appointmentTypesData = [
    { name: "Consultation", value: 45, color: "#3b82f6" },
    { name: "Follow-up", value: 30, color: "#10b981" },
    { name: "Check-up", value: 20, color: "#f59e0b" },
    { name: "Emergency", value: 5, color: "#ef4444" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "normal":
        return "border-l-blue-500"
      default:
        return "border-l-gray-500"
    }
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <CardHeader className="relative text-white pb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Welcome back, {user.name}!</CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-2">
                You have 12 appointments scheduled for today • 3 critical cases need attention
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-medium">4.8 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">127 Active Patients</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <AnimatedCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            change={item.change}
            color={item.color}
            bgColor={item.bgColor}
            description={item.description}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Today's Appointments */}
        <Card className="lg:col-span-2 border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b dark:from-blue-900/50 dark:to-cyan-900/50 dark:border-gray-700">
            <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {todaysAppointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className={cn(
                    "flex items-center justify-between p-4 border-b last:border-b-0 border-l-4 card-hover stagger-item",
                    getPriorityColor(appointment.priority),
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(appointment.status)}
                      <span className="text-xs text-gray-500 mt-1">{appointment.duration}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{appointment.patient}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.type}</p>
                      {appointment.priority === "high" && (
                        <Badge className="bg-red-100 text-red-800 text-xs mt-1 dark:bg-red-900 dark:text-red-300">High Priority</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{appointment.time}</p>
                    <Badge className={`${getStatusColor(appointment.status)} border text-xs`}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Lab Results */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b dark:from-purple-900/50 dark:to-pink-900/50 dark:border-gray-700">
            <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Lab Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="font-semibold dark:text-white">Patient</TableHead>
                  <TableHead className="font-semibold dark:text-white">Test</TableHead>
                  <TableHead className="font-semibold dark:text-white">Status</TableHead>
                  <TableHead className="font-semibold dark:text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{result.patient}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{result.date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{result.test}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(result.status)} border text-xs`}>{result.status}</Badge>
                      {result.priority === "high" && (
                        <Badge className="bg-red-100 text-red-800 text-xs ml-1 dark:bg-red-900 dark:text-red-300">Urgent</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {result.status === "completed" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLabResult(result)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Lab Results - {result.patient}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg dark:from-blue-900/50 dark:to-cyan-900/50">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100">{result.test}</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Date: {result.date}</p>
                              </div>
                              {result.results && (
                                <div className="grid grid-cols-2 gap-4">
                                  {Object.entries(result.results).map(([key, value]) => (
                                    <div key={key} className="bg-white p-3 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                      <div className="text-sm font-medium text-gray-500 capitalize dark:text-gray-400">
                                        {key.replace(/([A-Z])/g, " $1")}
                                      </div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Patient Satisfaction Trend */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b dark:from-green-900/50 dark:to-emerald-900/50 dark:border-gray-700">
            <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
              Patient Satisfaction Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                satisfaction: { label: "Satisfaction", color: "#10b981" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={satisfactionData}>
                  <defs>
                    <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Area
                    type="monotone"
                    dataKey="satisfaction"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorSatisfaction)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Enhanced Appointment Types Distribution */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b dark:from-orange-900/50 dark:to-yellow-900/50 dark:border-gray-700">
            <CardTitle className="text-gray-800 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Appointment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                consultation: { label: "Consultation", color: "#3b82f6" },
                followup: { label: "Follow-up", color: "#10b981" },
                checkup: { label: "Check-up", color: "#f59e0b" },
                emergency: { label: "Emergency", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentTypesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {appointmentTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AnimatedSidebar currentPage={currentPage} onPageChange={setCurrentPage} userRole="doctor" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatedTopNavbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 page-enter dark:bg-gray-900">
          {currentPage === "dashboard" && renderDashboard()}
          {currentPage === "patients" && <PatientsPage userRole="doctor" currentUser={user} />}
          {currentPage === "appointments" && <AppointmentsPage userRole="doctor" currentUser={user} />}
        </main>
      </div>
    </div>
  )
}

// Import management pages
import PatientsPage from "./patients-page"
import AppointmentsPage from "./appointments-page"
