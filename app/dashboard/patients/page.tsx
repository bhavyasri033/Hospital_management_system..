"use client"

import DashboardLayout from "@/app/layout/dashboard-layout"
import PatientsPage from "@/app/components/patients-page"

export default function PatientsRoute() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <PatientsPage userRole="admin" />
      </div>
    </DashboardLayout>
  )
}
