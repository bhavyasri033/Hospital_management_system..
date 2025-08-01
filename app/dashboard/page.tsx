"use client"

import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Total Patients</h3>
          <p className="text-2xl font-bold">247</p>
        </Card>
        {/* Add more dashboard cards */}
      </div>
    </div>
  )
}
