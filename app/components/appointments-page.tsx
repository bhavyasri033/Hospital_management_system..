"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Search, Filter, Plus, Eye, Edit, UserCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  appointmentId: string
  patientName: string
  doctorName: string
  date: string
  time: string
  type: "consultation" | "follow-up" | "check-up" | "emergency"
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled"
  notes: string
  department: string
}

interface AppointmentsPageProps {
  userRole: "admin" | "doctor"
  currentUser?: {
    id: string
    name: string
    email: string
    role: "admin" | "doctor" | "pharma"
  }
}

export default function AppointmentsPage({ userRole, currentUser }: AppointmentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date>()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Mock data with appointments for all doctors
  const appointments: Appointment[] = [
    // Dr. Sarah Johnson's appointments (Cardiology)
    {
      id: "1",
      appointmentId: "APT001",
      patientName: "John Doe",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-15",
      time: "09:00",
      type: "consultation",
      status: "confirmed",
      notes: "Cardiac consultation for chest pain symptoms",
      department: "Cardiology",
    },
    {
      id: "2",
      appointmentId: "APT002",
      patientName: "Mary Johnson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-15",
      time: "11:00",
      type: "follow-up",
      status: "scheduled",
      notes: "Follow-up after heart bypass surgery",
      department: "Cardiology",
    },
    {
      id: "3",
      appointmentId: "APT003",
      patientName: "Robert Chen",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-15",
      time: "14:00",
      type: "check-up",
      status: "completed",
      notes: "Annual cardiac check-up and ECG",
      department: "Cardiology",
    },
    {
      id: "4",
      appointmentId: "APT004",
      patientName: "Lisa Thompson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-15",
      time: "16:00",
      type: "consultation",
      status: "confirmed",
      notes: "Stress test review and treatment plan",
      department: "Cardiology",
    },
    {
      id: "5",
      appointmentId: "APT005",
      patientName: "David Miller",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-16",
      time: "08:30",
      type: "emergency",
      status: "in-progress",
      notes: "Emergency cardiac consultation - suspected heart attack",
      department: "Cardiology",
    },
    {
      id: "6",
      appointmentId: "APT006",
      patientName: "Sarah Wilson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-16",
      time: "10:00",
      type: "follow-up",
      status: "scheduled",
      notes: "Post-angioplasty follow-up",
      department: "Cardiology",
    },
    {
      id: "7",
      appointmentId: "APT007",
      patientName: "Michael Brown",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-16",
      time: "13:30",
      type: "consultation",
      status: "confirmed",
      notes: "Arrhythmia consultation and Holter monitor setup",
      department: "Cardiology",
    },
    {
      id: "8",
      appointmentId: "APT008",
      patientName: "Emma Davis",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-16",
      time: "15:30",
      type: "check-up",
      status: "scheduled",
      notes: "Routine cardiac check-up for hypertension",
      department: "Cardiology",
    },
    {
      id: "9",
      appointmentId: "APT009",
      patientName: "James Anderson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-17",
      time: "09:00",
      type: "consultation",
      status: "scheduled",
      notes: "Chest pain evaluation and diagnostic tests",
      department: "Cardiology",
    },
    {
      id: "10",
      appointmentId: "APT010",
      patientName: "Patricia Garcia",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-17",
      time: "11:00",
      type: "follow-up",
      status: "confirmed",
      notes: "Cardiac rehabilitation progress review",
      department: "Cardiology",
    },
    {
      id: "11",
      appointmentId: "APT011",
      patientName: "Kevin Taylor",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-17",
      time: "14:00",
      type: "consultation",
      status: "scheduled",
      notes: "Heart failure management consultation",
      department: "Cardiology",
    },
    {
      id: "12",
      appointmentId: "APT012",
      patientName: "Jennifer Lee",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-17",
      time: "16:00",
      type: "check-up",
      status: "scheduled",
      notes: "Pre-operative cardiac clearance",
      department: "Cardiology",
    },
    {
      id: "13",
      appointmentId: "APT013",
      patientName: "Thomas Wilson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-18",
      time: "08:00",
      type: "emergency",
      status: "cancelled",
      notes: "Emergency consultation - patient cancelled",
      department: "Cardiology",
    },
    {
      id: "14",
      appointmentId: "APT014",
      patientName: "Amanda Rodriguez",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-18",
      time: "10:30",
      type: "consultation",
      status: "confirmed",
      notes: "Cardiac catheterization results review",
      department: "Cardiology",
    },
    {
      id: "15",
      appointmentId: "APT015",
      patientName: "Christopher Martinez",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-18",
      time: "13:00",
      type: "follow-up",
      status: "scheduled",
      notes: "Post-stent placement follow-up",
      department: "Cardiology",
    },
    {
      id: "16",
      appointmentId: "APT016",
      patientName: "Rachel Green",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-18",
      time: "15:30",
      type: "check-up",
      status: "scheduled",
      notes: "Annual cardiac screening for high-risk patient",
      department: "Cardiology",
    },
    {
      id: "17",
      appointmentId: "APT017",
      patientName: "Daniel White",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-19",
      time: "09:00",
      type: "consultation",
      status: "confirmed",
      notes: "Palpitations and dizziness evaluation",
      department: "Cardiology",
    },
    {
      id: "18",
      appointmentId: "APT018",
      patientName: "Nicole Thompson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-19",
      time: "11:30",
      type: "follow-up",
      status: "scheduled",
      notes: "Medication adjustment for atrial fibrillation",
      department: "Cardiology",
    },
    {
      id: "19",
      appointmentId: "APT019",
      patientName: "Steven Clark",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-19",
      time: "14:00",
      type: "consultation",
      status: "scheduled",
      notes: "Family history of heart disease evaluation",
      department: "Cardiology",
    },
    {
      id: "20",
      appointmentId: "APT020",
      patientName: "Melissa Johnson",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-01-19",
      time: "16:30",
      type: "check-up",
      status: "confirmed",
      notes: "Post-pregnancy cardiac assessment",
      department: "Cardiology",
    },

    // Dr. Michael Brown's appointments (Orthopedics)
    {
      id: "21",
      appointmentId: "APT021",
      patientName: "Jane Smith",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-15",
      time: "10:30",
      type: "follow-up",
      status: "scheduled",
      notes: "Follow-up after knee surgery",
      department: "Orthopedics",
    },
    {
      id: "22",
      appointmentId: "APT022",
      patientName: "Tom Anderson",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-15",
      time: "15:00",
      type: "consultation",
      status: "confirmed",
      notes: "Back pain consultation",
      department: "Orthopedics",
    },
    {
      id: "23",
      appointmentId: "APT023",
      patientName: "Sarah Davis",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-16",
      time: "09:00",
      type: "check-up",
      status: "completed",
      notes: "Post-fracture recovery check",
      department: "Orthopedics",
    },
    {
      id: "24",
      appointmentId: "APT024",
      patientName: "Mike Wilson",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-16",
      time: "13:00",
      type: "consultation",
      status: "scheduled",
      notes: "Shoulder injury assessment",
      department: "Orthopedics",
    },
    {
      id: "25",
      appointmentId: "APT025",
      patientName: "Alex Johnson",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-17",
      time: "11:00",
      type: "follow-up",
      status: "confirmed",
      notes: "Hip replacement follow-up",
      department: "Orthopedics",
    },
    {
      id: "26",
      appointmentId: "APT026",
      patientName: "Emily White",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-17",
      time: "14:30",
      type: "consultation",
      status: "scheduled",
      notes: "Sports injury evaluation",
      department: "Orthopedics",
    },

    // Dr. Emily Davis's appointments (Emergency)
    {
      id: "27",
      appointmentId: "APT027",
      patientName: "Mike Johnson",
      doctorName: "Dr. Emily Davis",
      date: "2024-01-15",
      time: "14:00",
      type: "emergency",
      status: "in-progress",
      notes: "Emergency consultation",
      department: "Emergency",
    },
    {
      id: "28",
      appointmentId: "APT028",
      patientName: "Alex Rodriguez",
      doctorName: "Dr. Emily Davis",
      date: "2024-01-15",
      time: "16:30",
      type: "emergency",
      status: "completed",
      notes: "Trauma assessment",
      department: "Emergency",
    },
    {
      id: "29",
      appointmentId: "APT029",
      patientName: "Emma White",
      doctorName: "Dr. Emily Davis",
      date: "2024-01-16",
      time: "08:00",
      type: "consultation",
      status: "scheduled",
      notes: "Emergency follow-up",
      department: "Emergency",
    },
    {
      id: "30",
      appointmentId: "APT030",
      patientName: "David Clark",
      doctorName: "Dr. Emily Davis",
      date: "2024-01-16",
      time: "12:00",
      type: "emergency",
      status: "completed",
      notes: "Acute appendicitis",
      department: "Emergency",
    },

    // Dr. David Lee's appointments (General Medicine)
    {
      id: "31",
      appointmentId: "APT031",
      patientName: "Sarah Wilson",
      doctorName: "Dr. David Lee",
      date: "2024-01-16",
      time: "11:00",
      type: "check-up",
      status: "completed",
      notes: "Annual physical examination",
      department: "General Medicine",
    },
    {
      id: "32",
      appointmentId: "APT032",
      patientName: "James Brown",
      doctorName: "Dr. David Lee",
      date: "2024-01-16",
      time: "14:30",
      type: "consultation",
      status: "confirmed",
      notes: "General health consultation",
      department: "General Medicine",
    },
    {
      id: "33",
      appointmentId: "APT033",
      patientName: "Patricia Garcia",
      doctorName: "Dr. David Lee",
      date: "2024-01-17",
      time: "09:30",
      type: "follow-up",
      status: "scheduled",
      notes: "Diabetes management follow-up",
      department: "General Medicine",
    },
    {
      id: "34",
      appointmentId: "APT034",
      patientName: "Kevin Taylor",
      doctorName: "Dr. David Lee",
      date: "2024-01-17",
      time: "15:00",
      type: "consultation",
      status: "scheduled",
      notes: "Hypertension consultation",
      department: "General Medicine",
    },
    {
      id: "35",
      appointmentId: "APT035",
      patientName: "Lisa Anderson",
      doctorName: "Dr. David Lee",
      date: "2024-01-18",
      time: "10:00",
      type: "check-up",
      status: "confirmed",
      notes: "Routine health screening",
      department: "General Medicine",
    },
  ]

  const patients = [
    { id: "1", name: "John Doe", patientId: "P001" },
    { id: "2", name: "Jane Smith", patientId: "P002" },
    { id: "3", name: "Mike Johnson", patientId: "P003" },
    { id: "4", name: "Sarah Wilson", patientId: "P004" },
  ]

  const doctors = [
    { id: "1", name: "Dr. Sarah Johnson", department: "Cardiology" },
    { id: "2", name: "Dr. Michael Brown", department: "Orthopedics" },
    { id: "3", name: "Dr. Emily Davis", department: "Emergency" },
    { id: "4", name: "Dr. David Lee", department: "General Medicine" },
  ]

  const departments = ["Cardiology", "Orthopedics", "Emergency", "General Medicine", "Neurology", "Oncology"]
  const appointmentTypes = ["consultation", "follow-up", "check-up", "emergency"]

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    type: "consultation" as const,
    notes: "",
    department: "",
  })

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate = !dateFilter || appointment.date === format(dateFilter, "yyyy-MM-dd")
    
    // For doctors, only show appointments assigned to them
    const matchesDoctor = userRole === "admin" || appointment.doctorName === currentUser?.name
    
    return matchesSearch && matchesStatus && matchesDate && matchesDoctor
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "consultation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "follow-up":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "check-up":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "confirmed":
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case "scheduled":
        return <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const handleAddAppointment = () => {
    // Add appointment logic here
    setIsAddModalOpen(false)
    setNewAppointment({
      patientName: "",
      doctorName: "",
      date: "",
      time: "",
      type: "consultation",
      notes: "",
      department: "",
    })
  }

  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    // Update appointment status logic here
    console.log(`Updating appointment ${appointmentId} to status: ${newStatus}`)
  }

  const handleEditAppointment = () => {
    if (editingAppointment) {
      // Update appointment logic here
      console.log('Updating appointment:', editingAppointment)
      // In a real app, you would update the appointment in the database
      // For now, we'll just close the modal
      setIsEditModalOpen(false)
      setEditingAppointment(null)
    }
  }

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight dark:text-white">
            {userRole === "doctor" ? "My Appointments" : "Appointments"}
          </h2>
          <p className="text-muted-foreground dark:text-gray-400">
            {userRole === "doctor" 
              ? "View and manage your scheduled appointments" 
              : "Manage all appointments"
            }
          </p>
        </div>
        {userRole === "admin" && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient</Label>
                  <Select value={newAppointment.patientName} onValueChange={(value) => setNewAppointment({...newAppointment, patientName: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.name}>
                          {patient.name} - {patient.patientId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor</Label>
                  <Select value={newAppointment.doctorName} onValueChange={(value) => {
                    const selectedDoctor = doctors.find(doctor => doctor.name === value)
                    setNewAppointment({
                      ...newAppointment, 
                      doctorName: value,
                      department: selectedDoctor ? selectedDoctor.department : newAppointment.department
                    })
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.name}>
                          {doctor.name} - {doctor.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={newAppointment.department} onValueChange={(value) => setNewAppointment({...newAppointment, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    placeholder="Enter appointment notes"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment}>
                  Schedule Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:space-x-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full sm:w-[240px] justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-white", !dateFilter && "text-muted-foreground dark:text-gray-400")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Status</SelectItem>
            <SelectItem value="scheduled" className="dark:text-gray-300 dark:hover:bg-gray-700">Scheduled</SelectItem>
            <SelectItem value="confirmed" className="dark:text-gray-300 dark:hover:bg-gray-700">Confirmed</SelectItem>
            <SelectItem value="in-progress" className="dark:text-gray-300 dark:hover:bg-gray-700">In Progress</SelectItem>
            <SelectItem value="completed" className="dark:text-gray-300 dark:hover:bg-gray-700">Completed</SelectItem>
            <SelectItem value="cancelled" className="dark:text-gray-300 dark:hover:bg-gray-700">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg dark:text-white">{appointment.patientName}</CardTitle>
                  <CardDescription className="dark:text-gray-400">ID: {appointment.appointmentId}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(appointment.status)}
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <UserCheck className="mr-2 h-4 w-4" />
                  {appointment.doctorName}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {appointment.date} at {appointment.time}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(appointment.type)}>
                    {appointment.type}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{appointment.department}</span>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    {appointment.notes}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Appointment Details</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</Label>
                            <p className="text-lg font-semibold dark:text-white">{selectedAppointment.patientName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Doctor</Label>
                            <p className="text-lg font-semibold dark:text-white">{selectedAppointment.doctorName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</Label>
                            <p className="text-lg font-semibold dark:text-white">{selectedAppointment.date}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</Label>
                            <p className="text-lg font-semibold dark:text-white">{selectedAppointment.time}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</Label>
                            <Badge className={getTypeColor(selectedAppointment.type)}>
                              {selectedAppointment.type}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</Label>
                            <Badge className={getStatusColor(selectedAppointment.status)}>
                              {selectedAppointment.status}
                            </Badge>
                          </div>
                        </div>
                        {selectedAppointment.notes && (
                          <div>
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              {selectedAppointment.notes}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                            Close
                          </Button>
                          {selectedAppointment.status === 'scheduled' && (
                            <Button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}>
                              Confirm
                            </Button>
                          )}
                          {selectedAppointment.status === 'confirmed' && (
                            <Button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'in-progress')}>
                              Start
                            </Button>
                          )}
                          {selectedAppointment.status === 'in-progress' && (
                            <Button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}>
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Edit Appointment Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Edit Appointment</DialogTitle>
                    </DialogHeader>
                    {editingAppointment && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-patientName">Patient</Label>
                            <Select value={editingAppointment.patientName} onValueChange={(value) => setEditingAppointment({...editingAppointment, patientName: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {patients.map(patient => (
                                  <SelectItem key={patient.id} value={patient.name}>
                                    {patient.name} - {patient.patientId}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-doctorName">Doctor</Label>
                            <Select value={editingAppointment.doctorName} onValueChange={(value) => {
                              const selectedDoctor = doctors.find(doctor => doctor.name === value)
                              setEditingAppointment({
                                ...editingAppointment, 
                                doctorName: value,
                                department: selectedDoctor ? selectedDoctor.department : editingAppointment.department
                              })
                            }}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {doctors.map(doctor => (
                                  <SelectItem key={doctor.id} value={doctor.name}>
                                    {doctor.name} - {doctor.department}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                              id="edit-date"
                              type="date"
                              value={editingAppointment.date}
                              onChange={(e) => setEditingAppointment({...editingAppointment, date: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-time">Time</Label>
                            <Input
                              id="edit-time"
                              type="time"
                              value={editingAppointment.time}
                              onChange={(e) => setEditingAppointment({...editingAppointment, time: e.target.value})}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-type">Appointment Type</Label>
                            <Select value={editingAppointment.type} onValueChange={(value) => setEditingAppointment({...editingAppointment, type: value as any})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {appointmentTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={editingAppointment.status} onValueChange={(value) => setEditingAppointment({...editingAppointment, status: value as any})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-notes">Notes</Label>
                          <Textarea
                            id="edit-notes"
                            value={editingAppointment.notes}
                            onChange={(e) => setEditingAppointment({...editingAppointment, notes: e.target.value})}
                            placeholder="Enter appointment notes..."
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => {
                            setIsEditModalOpen(false)
                            setEditingAppointment(null)
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditAppointment}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {userRole === "admin" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditClick(appointment)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== "all" || dateFilter
              ? "Try adjusting your search or filter criteria."
              : "Get started by scheduling a new appointment."}
          </p>
        </div>
      )}
    </div>
  )
}
