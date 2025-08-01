"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Bed,
  Users,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Settings,
  MapPin,
  Activity,
  Wrench,
  UserPlus,
  RefreshCw,
  Building,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
import AnimatedCard from "./animated-card"
import { cn } from "@/lib/utils"

interface BedData {
  id: string
  bedNumber: string
  ward: string
  floor: number
  type: "ICU" | "General" | "Private" | "Emergency"
  status: "Available" | "Occupied" | "Cleaning" | "Maintenance" | "Reserved"
  assignedPatient?: {
    id: string
    name: string
    admissionDate: string
    condition: string
  }
  lastCleaned?: string
  maintenanceNotes?: string
}

interface PatientData {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  priority: "Low" | "Medium" | "High" | "Critical"
}

export default function BedManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterWard, setFilterWard] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedBed, setSelectedBed] = useState<BedData | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [maintenanceNotes, setMaintenanceNotes] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const { toast } = useToast()

  // Mock bed data
  const [bedsData, setBedsData] = useState<BedData[]>([
    {
      id: "1",
      bedNumber: "ICU-001",
      ward: "ICU",
      floor: 3,
      type: "ICU",
      status: "Occupied",
      assignedPatient: {
        id: "P001",
        name: "John Smith",
        admissionDate: "2024-01-15",
        condition: "Post-surgery recovery",
      },
      lastCleaned: "2024-01-20 08:00",
    },
    {
      id: "2",
      bedNumber: "ICU-002",
      ward: "ICU",
      floor: 3,
      type: "ICU",
      status: "Available",
      lastCleaned: "2024-01-20 10:30",
    },
    {
      id: "3",
      bedNumber: "GEN-101",
      ward: "General Ward A",
      floor: 1,
      type: "General",
      status: "Occupied",
      assignedPatient: {
        id: "P002",
        name: "Sarah Johnson",
        admissionDate: "2024-01-18",
        condition: "Pneumonia treatment",
      },
      lastCleaned: "2024-01-19 14:00",
    },
    {
      id: "4",
      bedNumber: "GEN-102",
      ward: "General Ward A",
      floor: 1,
      type: "General",
      status: "Cleaning",
      lastCleaned: "2024-01-20 11:00",
    },
    {
      id: "5",
      bedNumber: "PVT-201",
      ward: "Private Wing",
      floor: 2,
      type: "Private",
      status: "Reserved",
      lastCleaned: "2024-01-20 09:00",
    },
    {
      id: "6",
      bedNumber: "GEN-103",
      ward: "General Ward A",
      floor: 1,
      type: "General",
      status: "Maintenance",
      maintenanceNotes: "Bed frame repair needed",
      lastCleaned: "2024-01-19 16:00",
    },
    {
      id: "7",
      bedNumber: "ICU-003",
      ward: "ICU",
      floor: 3,
      type: "ICU",
      status: "Available",
      lastCleaned: "2024-01-20 12:00",
    },
    {
      id: "8",
      bedNumber: "GEN-201",
      ward: "General Ward B",
      floor: 2,
      type: "General",
      status: "Occupied",
      assignedPatient: {
        id: "P003",
        name: "Michael Brown",
        admissionDate: "2024-01-19",
        condition: "Diabetes management",
      },
      lastCleaned: "2024-01-19 08:00",
    },
    {
      id: "9",
      bedNumber: "EMG-001",
      ward: "Emergency Department",
      floor: 1,
      type: "Emergency",
      status: "Available",
      lastCleaned: "2024-01-20 13:00",
    },
    {
      id: "10",
      bedNumber: "EMG-002",
      ward: "Emergency Department",
      floor: 1,
      type: "Emergency",
      status: "Occupied",
      assignedPatient: {
      id: "P004",
      name: "Emily Davis",
        admissionDate: "2024-01-20",
        condition: "Trauma care",
      },
      lastCleaned: "2024-01-20 14:00",
    },
  ])

  const availablePatients: PatientData[] = [
    {
      id: "P005",
      name: "Robert Wilson",
      age: 62,
      gender: "Male",
      condition: "Post-operative care",
      priority: "Medium",
    },
    {
      id: "P006",
      name: "Lisa Anderson",
      age: 38,
      gender: "Female",
      condition: "Observation",
      priority: "Low",
    },
  ]

  // Calculate statistics
  const bedStats = useMemo(() => {
    const total = bedsData.length
    const occupied = bedsData.filter((bed) => bed.status === "Occupied").length
    const available = bedsData.filter((bed) => bed.status === "Available").length
    const maintenance = bedsData.filter((bed) => bed.status === "Maintenance").length
    const cleaning = bedsData.filter((bed) => bed.status === "Cleaning").length
    const icuBeds = bedsData.filter((bed) => bed.type === "ICU").length
    const icuOccupied = bedsData.filter((bed) => bed.type === "ICU" && bed.status === "Occupied").length

    return {
      total,
      occupied,
      available,
      maintenance,
      cleaning,
      icuBeds,
      icuOccupied,
      occupancyRate: Math.round((occupied / total) * 100),
      icuOccupancyRate: Math.round((icuOccupied / icuBeds) * 100),
    }
  }, [bedsData])

  // Ward distribution data
  const wardDistribution = useMemo(() => {
    const wards = bedsData.reduce(
      (acc, bed) => {
        if (!acc[bed.ward]) {
          acc[bed.ward] = { total: 0, occupied: 0, available: 0, maintenance: 0, cleaning: 0 }
        }
        acc[bed.ward].total++
        acc[bed.ward][bed.status.toLowerCase() as keyof (typeof acc)[string]]++
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.entries(wards).map(([ward, stats]) => ({
      ward,
      ...stats,
      occupancyRate: Math.round((stats.occupied / stats.total) * 100),
    }))
  }, [bedsData])

  // Status distribution for pie chart
  const statusDistribution = [
    { name: "Occupied", value: bedStats.occupied, color: "#ef4444" },
    { name: "Available", value: bedStats.available, color: "#22c55e" },
    { name: "Maintenance", value: bedStats.maintenance, color: "#f59e0b" },
    { name: "Cleaning", value: bedStats.cleaning, color: "#3b82f6" },
  ]

  // Get unique wards and types for filters
  const uniqueWards = useMemo(() => {
    const wards = [...new Set(bedsData.map(bed => bed.ward))].sort()
    return wards
  }, [bedsData])

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(bedsData.map(bed => bed.type))].sort()
    return types
  }, [bedsData])

  // Filter beds based on search and filters
  const filteredBeds = useMemo(() => {
    return bedsData.filter((bed) => {
      const matchesSearch =
        bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.assignedPatient?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesWard = filterWard === "all" || bed.ward === filterWard
      const matchesStatus = filterStatus === "all" || bed.status === filterStatus
      const matchesType = filterType === "all" || bed.type === filterType

      return matchesSearch && matchesWard && matchesStatus && matchesType
    })
  }, [bedsData, searchTerm, filterWard, filterStatus, filterType])

  // Group beds by floor
  const bedsByFloor = useMemo(() => {
    const grouped = filteredBeds.reduce((acc, bed) => {
      if (!acc[bed.floor]) {
        acc[bed.floor] = []
      }
      acc[bed.floor].push(bed)
      return acc
    }, {} as Record<number, BedData[]>)

    // Sort floors and beds within each floor
    return Object.entries(grouped)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .reduce((acc, [floor, beds]) => {
        acc[parseInt(floor)] = beds.sort((a, b) => a.bedNumber.localeCompare(b.bedNumber))
        return acc
      }, {} as Record<number, BedData[]>)
  }, [filteredBeds])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
      case "Occupied":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
      case "Cleaning":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
      case "Reserved":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircle className="h-4 w-4" />
      case "Occupied":
        return <Users className="h-4 w-4" />
      case "Cleaning":
        return <RefreshCw className="h-4 w-4" />
      case "Maintenance":
        return <Wrench className="h-4 w-4" />
      case "Reserved":
        return <Clock className="h-4 w-4" />
      default:
        return <Bed className="h-4 w-4" />
    }
  }

  const handleAssignPatient = () => {
    if (selectedBed && selectedPatient) {
      // Find the patient data
      const patient = availablePatients.find(p => p.id === selectedPatient)
      
      if (patient) {
        // Update the bed with the assigned patient
        const updatedBeds = bedsData.map(bed => 
          bed.id === selectedBed.id 
            ? {
                ...bed,
                status: "Occupied" as const,
                assignedPatient: {
                  id: patient.id,
                  name: patient.name,
                  admissionDate: new Date().toISOString().split('T')[0],
                  condition: patient.condition,
                }
              }
            : bed
        )
        
        setBedsData(updatedBeds)
        setIsAssignModalOpen(false)
        setSelectedPatient("")
        setSelectedBed(null)
        toast({
          title: "Patient Assigned",
          description: `Patient ${patient.name} has been assigned to bed ${selectedBed.bedNumber}`,
        })
      }
    }
  }

  const handleMaintenanceUpdate = () => {
    if (selectedBed && selectedStatus) {
      // Update the bed with the selected status and maintenance notes
      const updatedBeds = bedsData.map(bed => 
        bed.id === selectedBed.id 
          ? {
              ...bed,
              status: selectedStatus as BedData['status'],
              maintenanceNotes: maintenanceNotes || bed.maintenanceNotes,
              // Clear assigned patient if status is not Occupied
              assignedPatient: selectedStatus !== "Occupied" ? undefined : bed.assignedPatient,
            }
          : bed
      )
      
      setBedsData(updatedBeds)
      setIsMaintenanceModalOpen(false)
      setMaintenanceNotes("")
      setSelectedStatus("")
      setSelectedBed(null)
      toast({
        title: "Bed Updated",
        description: `Bed ${selectedBed.bedNumber} has been updated successfully`,
      })
    }
  }

  const handleStatusChange = (bed: BedData, newStatus: string) => {
    // Update the bed status
    const updatedBeds = bedsData.map(b => 
      b.id === bed.id 
        ? {
            ...b,
            status: newStatus as BedData['status'],
            // Clear assigned patient if status is not Occupied
            assignedPatient: newStatus !== "Occupied" ? undefined : b.assignedPatient,
          }
        : b
    )
    
    setBedsData(updatedBeds)
    toast({
      title: "Status Updated",
      description: `Bed ${bed.bedNumber} status changed to ${newStatus}`,
    })
  }

  const handleDischargePatient = (bed: BedData) => {
    // Discharge patient and make bed available
    const updatedBeds = bedsData.map(b => 
      b.id === bed.id 
        ? {
            ...b,
            status: "Available" as const,
            assignedPatient: undefined,
            lastCleaned: new Date().toLocaleString(),
          }
        : b
    )
    
    setBedsData(updatedBeds)
    toast({
      title: "Patient Discharged",
      description: `Patient discharged from bed ${bed.bedNumber}`,
    })
  }

  const openMaintenanceModal = (bed: BedData) => {
    setSelectedBed(bed)
    setSelectedStatus(bed.status)
    setMaintenanceNotes(bed.maintenanceNotes || "")
    setIsMaintenanceModalOpen(true)
  }

  const handleStatusButtonClick = (status: string) => {
    setSelectedStatus(status)
  }

  return (
    <div className="space-y-8 page-enter">
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard
          title="Total Beds"
          value={bedStats.total.toString()}
          icon={Bed}
          color="text-blue-600"
          bgColor="bg-blue-50"
          description="All hospital beds"
          delay={0}
        />
        <AnimatedCard
          title="Occupied Beds"
          value={bedStats.occupied.toString()}
          icon={Users}
          color="text-red-600"
          bgColor="bg-red-50"
          description={`${bedStats.occupancyRate}% occupancy rate`}
          delay={0.1}
        />
        <AnimatedCard
          title="Available Beds"
          value={bedStats.available.toString()}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          description="Ready for patients"
          delay={0.2}
        />
        <AnimatedCard
          title="ICU Beds"
          value={`${bedStats.icuOccupied}/${bedStats.icuBeds}`}
          icon={Activity}
          color="text-purple-600"
          bgColor="bg-purple-50"
          description={`${bedStats.icuOccupancyRate}% ICU occupancy`}
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bed Status Distribution */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <Bed className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Bed Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                occupied: { label: "Occupied", color: "#ef4444" },
                available: { label: "Available", color: "#22c55e" },
                maintenance: { label: "Maintenance", color: "#f59e0b" },
                cleaning: { label: "Cleaning", color: "#3b82f6" },
              }}
              className="h-[250px] chart-container"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Ward Distribution */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b dark:from-green-900/20 dark:to-emerald-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              Ward Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{
                occupied: { label: "Occupied", color: "#ef4444" },
                available: { label: "Available", color: "#22c55e" },
              }}
              className="h-[250px] chart-container"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardDistribution}>
                  <XAxis dataKey="ward" />
                  <YAxis />
                  <Bar dataKey="occupied" fill="#ef4444" name="Occupied" />
                  <Bar dataKey="available" fill="#22c55e" name="Available" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b dark:from-gray-700 dark:to-slate-700 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Bed Management
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search beds, wards, or patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
            </div>
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Filter by Ward" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Wards</SelectItem>
                {uniqueWards.map((ward) => (
                  <SelectItem key={ward} value={ward} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Status</SelectItem>
                <SelectItem value="Available" className="dark:text-gray-300 dark:hover:bg-gray-700">Available</SelectItem>
                <SelectItem value="Occupied" className="dark:text-gray-300 dark:hover:bg-gray-700">Occupied</SelectItem>
                <SelectItem value="Cleaning" className="dark:text-gray-300 dark:hover:bg-gray-700">Cleaning</SelectItem>
                <SelectItem value="Maintenance" className="dark:text-gray-300 dark:hover:bg-gray-700">Maintenance</SelectItem>
                <SelectItem value="Reserved" className="dark:text-gray-300 dark:hover:bg-gray-700">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Beds by Floor */}
          {Object.entries(bedsByFloor).map(([floor, beds]) => (
            <div key={floor} className="mb-8">
              {/* Floor Header */}
              <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700 dark:to-gray-700 rounded-lg border dark:border-gray-600">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Floor {floor}</h3>
                <Badge variant="outline" className="ml-auto dark:border-gray-600 dark:text-gray-300">
                  {beds.length} bed{beds.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Beds Table for this Floor */}
          <div className="rounded-lg border overflow-hidden dark:border-gray-600">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="font-semibold dark:text-white">Bed ID</TableHead>
                      <TableHead className="font-semibold dark:text-white">Ward Name</TableHead>
                      <TableHead className="font-semibold dark:text-white">Bed Type</TableHead>
                  <TableHead className="font-semibold dark:text-white">Status</TableHead>
                  <TableHead className="font-semibold dark:text-white">Assigned Patient</TableHead>
                  <TableHead className="font-semibold dark:text-white">Last Cleaned</TableHead>
                  <TableHead className="font-semibold dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {beds.map((bed, index) => (
                  <TableRow
                    key={bed.id}
                    className="table-row stagger-item dark:hover:bg-gray-700"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium dark:text-white">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {bed.bedNumber}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-white">
                        <div className="font-medium">{bed.ward}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium dark:border-gray-600 dark:text-gray-300">
                        {bed.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("status-badge border", getStatusColor(bed.status))}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(bed.status)}
                          {bed.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {bed.assignedPatient ? (
                        <div>
                          <div className="font-medium dark:text-white">{bed.assignedPatient.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{bed.assignedPatient.condition}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                          {bed.lastCleaned || "-"}
                          {bed.maintenanceNotes && (
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              <Wrench className="h-3 w-3 inline mr-1" />
                              {bed.maintenanceNotes}
                            </div>
                          )}
                        </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {bed.status === "Available" && (
                          <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="btn-animate bg-transparent"
                                onClick={() => setSelectedBed(bed)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        )}
                        <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="btn-animate bg-transparent"
                                  onClick={() => openMaintenanceModal(bed)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        {bed.status === "Cleaning" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="btn-animate text-green-600 hover:text-green-700 bg-transparent"
                            onClick={() => handleStatusChange(bed, "Available")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                            {bed.status === "Occupied" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="btn-animate text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => handleDischargePatient(bed)}
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                            )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            </div>
          ))}

          {/* No Results Message */}
          {Object.keys(bedsByFloor).length === 0 && (
            <div className="text-center py-12">
              <Bed className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No beds found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Assignment Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="modal-content dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Assign Patient to Bed {selectedBed?.bedNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient-select">Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a patient to assign" />
                </SelectTrigger>
                <SelectContent>
                  {availablePatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{patient.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-2",
                            patient.priority === "Critical" && "border-red-500 text-red-700",
                            patient.priority === "High" && "border-orange-500 text-orange-700",
                            patient.priority === "Medium" && "border-yellow-500 text-yellow-700",
                            patient.priority === "Low" && "border-green-500 text-green-700",
                          )}
                        >
                          {patient.priority}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPatient && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {(() => {
                  const patient = availablePatients.find((p) => p.id === selectedPatient)
                  return patient ? (
                    <div>
                      <h4 className="font-medium dark:text-white">{patient.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {patient.age} years old, {patient.gender}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Condition: {patient.condition}</p>
                    </div>
                  ) : null
                })()}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignPatient} disabled={!selectedPatient} className="btn-animate">
                Assign Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Maintenance Modal */}
      <Dialog open={isMaintenanceModalOpen} onOpenChange={setIsMaintenanceModalOpen}>
        <DialogContent className="modal-content dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Manage Bed {selectedBed?.bedNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Status</Label>
              <Badge className={cn("status-badge border mt-1", selectedBed && getStatusColor(selectedBed.status))}>
                {selectedBed?.status}
              </Badge>
            </div>
            <div>
              <Label>Update Status</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={selectedStatus === "Cleaning" ? "default" : "outline"}
                  className={cn(
                    "btn-animate",
                    selectedStatus === "Cleaning" ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent"
                  )}
                  onClick={() => handleStatusButtonClick("Cleaning")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Mark for Cleaning
                </Button>
                <Button
                  variant={selectedStatus === "Maintenance" ? "default" : "outline"}
                  className={cn(
                    "btn-animate",
                    selectedStatus === "Maintenance" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-transparent"
                  )}
                  onClick={() => handleStatusButtonClick("Maintenance")}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Mark Maintenance
                </Button>
                <Button
                  variant={selectedStatus === "Available" ? "default" : "outline"}
                  className={cn(
                    "btn-animate",
                    selectedStatus === "Available" ? "bg-green-600 hover:bg-green-700" : "bg-transparent"
                  )}
                  onClick={() => handleStatusButtonClick("Available")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Available
                </Button>
                <Button
                  variant={selectedStatus === "Reserved" ? "default" : "outline"}
                  className={cn(
                    "btn-animate",
                    selectedStatus === "Reserved" ? "bg-purple-600 hover:bg-purple-700" : "bg-transparent"
                  )}
                  onClick={() => handleStatusButtonClick("Reserved")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reserve Bed
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="maintenance-notes">Maintenance Notes</Label>
              <Textarea
                id="maintenance-notes"
                placeholder="Enter maintenance notes or cleaning instructions..."
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
                className="form-field"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsMaintenanceModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleMaintenanceUpdate} 
                disabled={!selectedStatus}
                className="btn-animate"
              >
                Update Bed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
