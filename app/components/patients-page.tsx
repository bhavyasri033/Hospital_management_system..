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
import { Search, Filter, Plus, Eye, Edit, Phone, Mail, Calendar, User, MapPin } from "lucide-react"
import { useDoctors } from "./doctors-context"
import { usePatients } from "./patients-context"

interface Patient {
  id: string
  name: string
  patientId: string
  age: number
  gender: "male" | "female" | "other"
  phone: string
  email: string
  address: string
  bloodGroup: string
  status: "active" | "inactive" | "critical"
  lastVisit: string
  diagnosis: string
  doctor: string
}

interface PatientsPageProps {
  userRole?: "admin" | "doctor" | "pharma"
  currentUser?: {
    id: string
    name: string
    email: string
    role: "admin" | "doctor" | "pharma"
  }
}

export default function PatientsPage({ userRole = "admin", currentUser }: PatientsPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const { doctors } = useDoctors()
  const { patients, addPatient, updatePatient } = usePatients()

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    diagnosis: "",
    doctor: "",
  })

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    
    // For doctors, only show patients assigned to them
    const matchesDoctor = userRole === "admin" || patient.doctor === currentUser?.name
    
    return matchesSearch && matchesStatus && matchesDoctor
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const handleAddPatient = () => {
    const patient: Patient = {
      id: Date.now().toString(),
      patientId: `P${String(patients.length + 1).padStart(3, "0")}`,
      name: newPatient.name,
      age: Number.parseInt(newPatient.age),
      gender: newPatient.gender as "male" | "female" | "other",
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      bloodGroup: newPatient.bloodGroup,
      status: "active",
      lastVisit: "",
      diagnosis: newPatient.diagnosis,
      doctor: newPatient.doctor,
    }

    addPatient(patient)
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "",
      diagnosis: "",
      doctor: "",
    })
    setIsAddModalOpen(false)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setIsEditModalOpen(true)
  }

  const handleUpdatePatient = () => {
    if (!editingPatient) return

    updatePatient(editingPatient)
    setEditingPatient(null)
    setIsEditModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">
            {userRole === "doctor" ? "My Patients" : "Patients"}
          </h2>
          <p className="text-muted-foreground">
            {userRole === "doctor" 
              ? "View and manage your assigned patients" 
              : "Manage patient records and information"
            }
          </p>
        </div>
        {userRole === "admin" && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    placeholder="Enter age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={newPatient.bloodGroup}
                    onValueChange={(value) => setNewPatient({ ...newPatient, bloodGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={newPatient.diagnosis}
                    onChange={(e) => setNewPatient({ ...newPatient, diagnosis: e.target.value })}
                    placeholder="Enter diagnosis"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="doctor">Assigned Doctor</Label>
                  <Select
                    value={newPatient.doctor}
                    onValueChange={(value) => setNewPatient({ ...newPatient, doctor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.name}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient}>Add Patient</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">{patient.name}</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    ID: {patient.patientId}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="dark:text-gray-300">{patient.age} years old</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="dark:text-gray-300">{patient.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="dark:text-gray-300">{patient.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="dark:text-gray-300">Dr. {patient.doctor}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Patient Details</DialogTitle>
                    </DialogHeader>
                    {selectedPatient && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold dark:text-white">{selectedPatient.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">Patient ID: {selectedPatient.patientId}</p>
                            <Badge className={getStatusColor(selectedPatient.status)}>{selectedPatient.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg dark:text-white">Personal Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</label>
                                <p className="dark:text-white">{selectedPatient.age} years old</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                                <p className="capitalize dark:text-white">{selectedPatient.gender}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Group</label>
                                <p className="dark:text-white">{selectedPatient.bloodGroup}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg dark:text-white">Contact Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <p className="dark:text-white">{selectedPatient.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                <p className="dark:text-white">{selectedPatient.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                <p className="dark:text-white">{selectedPatient.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg dark:text-white">Medical Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Doctor</label>
                              <p className="dark:text-white">{selectedPatient.doctor}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Group</label>
                              <p className="dark:text-white">{selectedPatient.bloodGroup}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Diagnosis</label>
                            <p className="dark:text-white">{selectedPatient.diagnosis}</p>
                          </div>
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
                    onClick={() => handleEditPatient(patient)}
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

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding a new patient."}
          </p>
        </div>
      )}

      {/* Edit Patient Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={editingPatient.age}
                  onChange={(e) => setEditingPatient({ ...editingPatient, age: Number.parseInt(e.target.value) })}
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={editingPatient.gender}
                  onValueChange={(value) => setEditingPatient({ ...editingPatient, gender: value as "male" | "female" | "other" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingPatient.phone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingPatient.email}
                  onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bloodGroup">Blood Group</Label>
                <Select
                  value={editingPatient.bloodGroup}
                  onValueChange={(value) => setEditingPatient({ ...editingPatient, bloodGroup: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingPatient.status}
                  onValueChange={(value) => setEditingPatient({ ...editingPatient, status: value as "active" | "inactive" | "critical" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={editingPatient.address}
                  onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-diagnosis">Diagnosis</Label>
                <Textarea
                  id="edit-diagnosis"
                  value={editingPatient.diagnosis}
                  onChange={(e) => setEditingPatient({ ...editingPatient, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-doctor">Assigned Doctor</Label>
                <Select
                  value={editingPatient.doctor}
                  onValueChange={(value) => setEditingPatient({ ...editingPatient, doctor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.name}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePatient}>Update Patient</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
