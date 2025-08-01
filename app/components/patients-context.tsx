"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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

interface PatientsContextType {
  patients: Patient[]
  setPatients: (patients: Patient[]) => void
  addPatient: (patient: Patient) => void
  updatePatient: (patient: Patient) => void
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined)

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Doe",
      patientId: "P001",
      age: 45,
      gender: "male",
      phone: "+1 234-567-8901",
      email: "john.doe@email.com",
      address: "123 Main St, New York, NY 10001",
      bloodGroup: "O+",
      status: "active",
      lastVisit: "",
      diagnosis: "Hypertension",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "2",
      name: "Jane Wilson",
      patientId: "P002",
      age: 32,
      gender: "female",
      phone: "+1 234-567-8902",
      email: "jane.wilson@email.com",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      bloodGroup: "A+",
      status: "critical",
      lastVisit: "",
      diagnosis: "Diabetes Type 2",
      doctor: "Dr. Michael Smith",
    },
    {
      id: "3",
      name: "Mike Brown",
      patientId: "P003",
      age: 28,
      gender: "male",
      phone: "+1 234-567-8903",
      email: "mike.brown@email.com",
      address: "789 Pine Rd, Chicago, IL 60601",
      bloodGroup: "B+",
      status: "active",
      lastVisit: "",
      diagnosis: "Routine Checkup",
      doctor: "Dr. Emily Davis",
    },
    {
      id: "4",
      name: "Sarah Lee",
      patientId: "P004",
      age: 55,
      gender: "female",
      phone: "+1 234-567-8904",
      email: "sarah.lee@email.com",
      address: "321 Elm St, Houston, TX 77001",
      bloodGroup: "AB+",
      status: "inactive",
      lastVisit: "",
      diagnosis: "Arthritis",
      doctor: "Dr. Sarah Johnson",
    },
  ])

  const addPatient = (patient: Patient) => {
    setPatients([...patients, patient])
  }

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map((patient) =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    ))
  }

  return (
    <PatientsContext.Provider value={{ patients, setPatients, addPatient, updatePatient }}>
      {children}
    </PatientsContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientsContext)
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientsProvider")
  }
  return context
} 