"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, AlertTriangle, Calendar, DollarSign, Truck, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import AnimatedSidebar from "./animated-sidebar"
import AnimatedTopNavbar from "./animated-top-navbar"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "doctor" | "pharma"
}

interface PharmaDashboardProps {
  user: User
  onLogout: () => void
}

export default function PharmaDashboard({ user, onLogout }: PharmaDashboardProps) {
  const [currentPage, setCurrentPage] = useState("dashboard")

  // Enhanced mock data
  const summaryData = [
    {
      title: "Total Inventory",
      value: "5,678",
      icon: Package,
      change: "+2%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Active medicine items",
    },
    {
      title: "Critical Alerts",
      value: "23",
      icon: AlertTriangle,
      change: "+5",
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Low stock warnings",
    },
    {
      title: "Expiring Soon",
      value: "12",
      icon: Calendar,
      change: "-3",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Within 30 days",
    },
    {
      title: "Inventory Value",
      value: "₹234,567",
      icon: DollarSign,
      change: "+8%",
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Total stock value",
    },
  ]

  const lowStockAlerts = [
    {
      id: "1",
      medicine: "Paracetamol 500mg",
      category: "Analgesic",
      currentStock: 50,
      minStock: 100,
      status: "critical",
      supplier: "MedSupply Co.",
      lastOrdered: "2024-01-10",
    },
    {
      id: "2",
      medicine: "Amoxicillin 250mg",
      category: "Antibiotic",
      currentStock: 75,
      minStock: 150,
      status: "low",
      supplier: "PharmaCorp",
      lastOrdered: "2024-01-08",
    },
    {
      id: "3",
      medicine: "Insulin Glargine",
      category: "Diabetes",
      currentStock: 25,
      minStock: 50,
      status: "critical",
      supplier: "Global Pharma",
      lastOrdered: "2024-01-12",
    },
    {
      id: "4",
      medicine: "Lisinopril 10mg",
      category: "Cardiovascular",
      currentStock: 120,
      minStock: 200,
      status: "low",
      supplier: "HealthMeds Ltd.",
      lastOrdered: "2024-01-05",
    },
  ]

  const expiringMedicines = [
    {
      id: "1",
      medicine: "Aspirin 75mg",
      batch: "ASP001",
      expiryDate: "2024-02-15",
      quantity: 200,
      daysToExpiry: 15,
      value: "₹450",
    },
    {
      id: "2",
      medicine: "Metformin 500mg",
      batch: "MET002",
      expiryDate: "2024-02-28",
      quantity: 150,
      daysToExpiry: 28,
      value: "₹320",
    },
    {
      id: "3",
      medicine: "Omeprazole 20mg",
      batch: "OME003",
      expiryDate: "2024-03-10",
      quantity: 100,
      daysToExpiry: 38,
      value: "₹280",
    },
    {
      id: "4",
      medicine: "Atorvastatin 20mg",
      batch: "ATO004",
      expiryDate: "2024-03-20",
      quantity: 75,
      daysToExpiry: 48,
      value: "₹380",
    },
  ]

  const recentOrders = [
    {
      id: "1",
      supplier: "MedSupply Co.",
      orderDate: "2024-01-10",
      items: 25,
      total: "₹12,450",
      status: "delivered",
      trackingId: "MS001234",
    },
    {
      id: "2",
      supplier: "PharmaCorp",
      orderDate: "2024-01-12",
      items: 18,
      total: "₹8,750",
      status: "pending",
      trackingId: "PC005678",
    },
    {
      id: "3",
      supplier: "HealthMeds Ltd.",
      orderDate: "2024-01-14",
      items: 32,
      total: "₹15,200",
      status: "shipped",
      trackingId: "HM009876",
    },
    {
      id: "4",
      supplier: "Global Pharma",
      orderDate: "2024-01-15",
      items: 12,
      total: "₹6,800",
      status: "processing",
      trackingId: "GP001122",
    },
  ]

  // Medicine Categories Data for Pie Chart
  const medicineCategoriesData = [
    { name: "Antibiotics", value: 1250, color: "#3b82f6" },
    { name: "Analgesics", value: 980, color: "#10b981" },
    { name: "Cardiovascular", value: 750, color: "#f59e0b" },
    { name: "Diabetes", value: 620, color: "#ef4444" },
    { name: "Respiratory", value: 480, color: "#8b5cf6" },
    { name: "Gastrointestinal", value: 390, color: "#06b6d4" },
    { name: "Others", value: 208, color: "#84cc16" },
  ]

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getExpiryStatusColor = (days: number) => {
    if (days <= 30) return "bg-red-100 text-red-800 border-red-200"
    if (days <= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-white">{item.title}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-300">{item.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${item.bgColor} dark:bg-opacity-20`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{item.value}</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${item.change.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {item.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-300">from last period</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b dark:from-red-900/20 dark:to-pink-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Critical Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="font-semibold dark:text-gray-200">Medicine</TableHead>
                  <TableHead className="font-semibold dark:text-gray-200">Stock</TableHead>
                  <TableHead className="font-semibold dark:text-gray-200">Status</TableHead>
                  <TableHead className="font-semibold dark:text-gray-200">Supplier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockAlerts.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.medicine}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span
                          className={
                            item.status === "critical" ? "text-red-600 dark:text-red-400 font-bold" : "text-yellow-600 dark:text-yellow-400 font-medium"
                          }
                        >
                          {item.currentStock}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">/{item.minStock}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStockStatusColor(item.status)} border`}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-700 dark:text-gray-300">{item.supplier}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last: {item.lastOrdered}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Expiring Medicines */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b dark:from-orange-900/20 dark:to-yellow-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <Calendar className="h-5 w-5 text-orange-600" />
              Expiring Medicines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="font-semibold dark:text-gray-200">Medicine</TableHead>
                  <TableHead className="font-semibold dark:text-gray-200">Batch</TableHead>
                  <TableHead className="font-semibold dark:text-gray-200">Expiry</TableHead>
                  <TableHead className="font-semibold dark:text-gray-200">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringMedicines.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.medicine}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-700 dark:text-gray-300">{item.batch}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.expiryDate}</p>
                        <Badge className={`${getExpiryStatusColor(item.daysToExpiry)} border text-xs`}>
                          {item.daysToExpiry} days
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Recent Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-700">
                <TableHead className="font-semibold dark:text-gray-200">Supplier</TableHead>
                <TableHead className="font-semibold dark:text-gray-200">Order Date</TableHead>
                <TableHead className="font-semibold dark:text-gray-200">Items</TableHead>
                <TableHead className="font-semibold dark:text-gray-200">Total</TableHead>
                <TableHead className="font-semibold dark:text-gray-200">Status</TableHead>
                <TableHead className="font-semibold dark:text-gray-200">Tracking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="font-medium text-gray-900 dark:text-white">{order.supplier}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{order.items} items</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900 dark:text-white">{order.total}</TableCell>
                  <TableCell>
                    <Badge className={`${getOrderStatusColor(order.status)} border`}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{order.trackingId}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine Categories Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <Package className="h-5 w-5 text-indigo-600" />
              Medicine Categories Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={medicineCategoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {medicineCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status Overview */}
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Inventory Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">In Stock</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">4,567</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Low Stock</span>
                </div>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">234</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Critical</span>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">23</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Expiring Soon</span>
                </div>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AnimatedSidebar currentPage={currentPage} onPageChange={setCurrentPage} userRole="pharma" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatedTopNavbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 page-enter dark:bg-gray-900">
          {currentPage === "dashboard" && renderDashboard()}
          {currentPage === "inventory" && <InventoryPage userRole="pharma" />}
        </main>
      </div>
    </div>
  )
}

// Import management pages
import InventoryPage from "./inventory-page"
