"use client"

import { useState } from "react"
import { useDoctors } from "./doctors-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  MapPin,
  Download,
  Clock,
} from "lucide-react"

interface Doctor {
  id: string
  name: string
  doctorId: string
  department: string
  specialization: string
  phone: string
  email: string
  experience: number
  status: "active" | "inactive" | "on-leave"
  availability: {
    [key: string]: { morning: boolean; afternoon: boolean; evening: boolean }
  }
}

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  const { doctors, setDoctors, addDoctor, updateDoctor } = useDoctors()

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    department: "",
    customDepartment: "",
    specialization: "",
    phone: "",
    email: "",
    experience: "",
    availability: {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false },
    },
  })

  const [departments, setDepartments] = useState(["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "Psychiatry"])
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const timeSlots = ["morning", "afternoon", "evening"]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || doctor.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const handleAddDoctor = () => {
    // Determine the final department name
    const finalDepartment = newDoctor.department === "other" ? newDoctor.customDepartment : newDoctor.department
    
    // Add new department to the list if it's a custom one
    if (newDoctor.department === "other" && newDoctor.customDepartment && !departments.includes(newDoctor.customDepartment)) {
      setDepartments([...departments, newDoctor.customDepartment])
    }

    const doctor: Doctor = {
      id: Date.now().toString(),
      doctorId: `D${String(doctors.length + 1).padStart(3, "0")}`,
      name: newDoctor.name,
      department: finalDepartment,
      specialization: newDoctor.specialization,
      phone: newDoctor.phone,
      email: newDoctor.email,
      experience: Number.parseInt(newDoctor.experience),
      status: "active",
      availability: newDoctor.availability,
    }

    addDoctor(doctor)
    setNewDoctor({
      name: "",
      department: "",
      customDepartment: "",
      specialization: "",
      phone: "",
      email: "",
      experience: "",
      availability: {
        monday: { morning: false, afternoon: false, evening: false },
        tuesday: { morning: false, afternoon: false, evening: false },
        wednesday: { morning: false, afternoon: false, evening: false },
        thursday: { morning: false, afternoon: false, evening: false },
        friday: { morning: false, afternoon: false, evening: false },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false },
      },
    })
    setIsAddModalOpen(false)
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setIsEditModalOpen(true)
  }

  const handleUpdateDoctor = () => {
    if (!editingDoctor) return

    updateDoctor(editingDoctor)
    setEditingDoctor(null)
    setIsEditModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Doctors</h2>
          <p className="text-muted-foreground dark:text-gray-400">Manage doctor profiles and schedules</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Add New Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newDoctor.name}
                      onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newDoctor.department}
                      onValueChange={(value) => setNewDoctor({ ...newDoctor, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newDoctor.department === "other" && (
                    <div className="col-span-1 sm:col-span-2 space-y-2">
                      <Label htmlFor="customDepartment">Custom Department Name</Label>
                      <Input
                        id="customDepartment"
                        value={newDoctor.customDepartment}
                        onChange={(e) => setNewDoctor({ ...newDoctor, customDepartment: e.target.value })}
                        placeholder="Enter department name"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={newDoctor.specialization}
                      onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                      placeholder="Enter specialization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={newDoctor.experience}
                      onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newDoctor.phone}
                      onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDoctor.email}
                      onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Weekly Availability</Label>
                  <div className="border rounded-lg p-4">
                    {/* Mobile-friendly availability layout */}
                    <div className="space-y-3">
                      {days.map((day) => (
                        <div key={day} className="border-b border-gray-200 pb-3 last:border-b-0">
                          <div className="font-medium capitalize mb-2 text-sm">{day}</div>
                          <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map((slot) => (
                              <div key={slot} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${day}-${slot}`}
                                  checked={
                                    newDoctor.availability[day as keyof typeof newDoctor.availability][slot as keyof (typeof newDoctor.availability)[keyof typeof newDoctor.availability]]
                                  }
                                  onCheckedChange={(checked) => {
                                    setNewDoctor({
                                      ...newDoctor,
                                      availability: {
                                        ...newDoctor.availability,
                                        [day]: {
                                          ...newDoctor.availability[day as keyof typeof newDoctor.availability],
                                          [slot]: checked,
                                        },
                                      },
                                    })
                                  }}
                                />
                                <Label htmlFor={`${day}-${slot}`} className="text-xs capitalize cursor-pointer">
                                  {slot}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleAddDoctor} className="w-full sm:w-auto">Add Doctor</Button>
              </div>
            </DialogContent>
        </Dialog>

        {/* Edit Doctor Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Edit Doctor</DialogTitle>
            </DialogHeader>
            {editingDoctor && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editingDoctor.name}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Select
                      value={editingDoctor.department}
                      onValueChange={(value) => setEditingDoctor({ ...editingDoctor, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-specialization">Specialization</Label>
                    <Input
                      id="edit-specialization"
                      value={editingDoctor.specialization}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                      placeholder="Enter specialization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-experience">Experience (Years)</Label>
                    <Input
                      id="edit-experience"
                      type="number"
                      value={editingDoctor.experience}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: Number.parseInt(e.target.value) })}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingDoctor.phone}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingDoctor.email}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingDoctor.status}
                      onValueChange={(value) => setEditingDoctor({ ...editingDoctor, status: value as "active" | "inactive" | "on-leave" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Weekly Availability</Label>
                  <div className="border rounded-lg p-4">
                    {/* Mobile-friendly availability layout */}
                    <div className="space-y-3">
                      {days.map((day) => (
                        <div key={day} className="border-b border-gray-200 pb-3 last:border-b-0">
                          <div className="font-medium capitalize mb-2 text-sm">{day}</div>
                          <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map((slot) => (
                              <div key={slot} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${day}-${slot}`}
                                  checked={editingDoctor.availability[day as keyof typeof editingDoctor.availability][slot as keyof (typeof editingDoctor.availability)[keyof typeof editingDoctor.availability]]}
                                  onCheckedChange={(checked) => {
                                    setEditingDoctor({
                                      ...editingDoctor,
                                      availability: {
                                        ...editingDoctor.availability,
                                        [day]: {
                                          ...editingDoctor.availability[day as keyof typeof editingDoctor.availability],
                                          [slot]: checked,
                                        },
                                      },
                                    })
                                  }}
                                />
                                <Label htmlFor={`${day}-${slot}`} className="text-xs capitalize cursor-pointer">
                                  {slot}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDoctor}>Update Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept} className="dark:text-gray-300 dark:hover:bg-gray-700">
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg dark:text-white">{doctor.name}</CardTitle>
                    <CardDescription className="dark:text-gray-400">ID: {doctor.doctorId}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(doctor.status)}>{doctor.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="mr-2 h-4 w-4" />
                  {doctor.department}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Specialization:</strong> {doctor.specialization}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="mr-2 h-4 w-4" />
                  {doctor.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="mr-2 h-4 w-4" />
                  {doctor.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  {doctor.experience} years experience
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Doctor Details</DialogTitle>
                    </DialogHeader>
                    {selectedDoctor && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold dark:text-white">{selectedDoctor.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">Doctor ID: {selectedDoctor.doctorId}</p>
                            <Badge className={getStatusColor(selectedDoctor.status)}>{selectedDoctor.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg dark:text-white">Professional Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</label>
                                <p className="dark:text-white">{selectedDoctor.department}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Specialization</label>
                                <p className="dark:text-white">{selectedDoctor.specialization}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</label>
                                <p className="dark:text-white">{selectedDoctor.experience} years</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg dark:text-white">Contact Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <p className="dark:text-white">{selectedDoctor.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                <p className="dark:text-white">{selectedDoctor.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center gap-2 dark:text-white">
                            <Clock className="h-5 w-5" />
                            Weekly Availability
                          </h4>
                          <div className="border rounded-lg p-4 dark:border-gray-600">
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div className="font-medium dark:text-white">Day</div>
                              <div className="font-medium text-center dark:text-white">Morning</div>
                              <div className="font-medium text-center dark:text-white">Afternoon</div>
                              <div className="font-medium text-center dark:text-white">Evening</div>

                              {days.map((day) => (
                                <div key={day} className="contents">
                                  <div className="capitalize py-2 font-medium dark:text-white">{day}</div>
                                  {timeSlots.map((slot) => (
                                    <div key={slot} className="flex justify-center py-2">
                                      {selectedDoctor.availability[day][
                                        slot as keyof (typeof selectedDoctor.availability)[typeof day]
                                      ] ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Available</Badge>
                                      ) : (
                                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Not Available</Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-transparent"
                  onClick={() => handleEditDoctor(doctor)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || departmentFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding a new doctor."}
          </p>
        </div>
      )}
    </div>
  )
}
