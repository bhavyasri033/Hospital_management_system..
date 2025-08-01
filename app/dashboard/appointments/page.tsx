"use client"

import DashboardLayout from "@/app/layout/dashboard-layout"
import AppointmentsPage from "@/app/components/appointments-page"

export default function AppointmentsRoute() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <AppointmentsPage userRole="admin" />
      </div>
    </DashboardLayout>
  )
}
