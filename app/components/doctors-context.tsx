"use client"

import { createContext, useContext, useState, ReactNode } from "react"

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

interface DoctorsContextType {
  doctors: Doctor[]
  setDoctors: (doctors: Doctor[]) => void
  addDoctor: (doctor: Doctor) => void
  updateDoctor: (doctor: Doctor) => void
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined)

export function DoctorsProvider({ children }: { children: ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      doctorId: "D001",
      department: "Cardiology",
      specialization: "Interventional Cardiology",
      phone: "+1 234-567-8901",
      email: "sarah.johnson@hospital.com",
      experience: 12,
      status: "active",
      availability: {
        monday: { morning: true, afternoon: true, evening: false },
        tuesday: { morning: true, afternoon: false, evening: true },
        wednesday: { morning: true, afternoon: true, evening: false },
        thursday: { morning: false, afternoon: true, evening: true },
        friday: { morning: true, afternoon: true, evening: false },
        saturday: { morning: true, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false },
      },
    },
    {
      id: "2",
      name: "Dr. Michael Smith",
      doctorId: "D002",
      department: "Neurology",
      specialization: "Pediatric Neurology",
      phone: "+1 234-567-8902",
      email: "michael.smith@hospital.com",
      experience: 8,
      status: "active",
      availability: {
        monday: { morning: true, afternoon: true, evening: true },
        tuesday: { morning: true, afternoon: true, evening: false },
        wednesday: { morning: false, afternoon: true, evening: true },
        thursday: { morning: true, afternoon: true, evening: false },
        friday: { morning: true, afternoon: false, evening: true },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false },
      },
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      doctorId: "D003",
      department: "Pediatrics",
      specialization: "Neonatology",
      phone: "+1 234-567-8903",
      email: "emily.davis@hospital.com",
      experience: 15,
      status: "on-leave",
      availability: {
        monday: { morning: false, afternoon: false, evening: false },
        tuesday: { morning: false, afternoon: false, evening: false },
        wednesday: { morning: false, afternoon: false, evening: false },
        thursday: { morning: false, afternoon: false, evening: false },
        friday: { morning: false, afternoon: false, evening: false },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false },
      },
    },
  ])

  const addDoctor = (doctor: Doctor) => {
    setDoctors([...doctors, doctor])
  }

  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map((doctor) =>
      doctor.id === updatedDoctor.id ? updatedDoctor : doctor
    ))
  }

  return (
    <DoctorsContext.Provider value={{ doctors, setDoctors, addDoctor, updateDoctor }}>
      {children}
    </DoctorsContext.Provider>
  )
}

export function useDoctors() {
  const context = useContext(DoctorsContext)
  if (context === undefined) {
    throw new Error("useDoctors must be used within a DoctorsProvider")
  }
  return context
} 