"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, Plus, Eye, Edit, Package, Calendar, DollarSign, AlertTriangle, Truck, ChevronDown, IndianRupee } from "lucide-react"
import AnimatedButton from "./animated-button"

interface InventoryItem {
  id: string
  name: string
  category: string
  supplier: string
  quantity: number
  minStock: number
  unitPrice: number
  expiryDate: string
  batchNumber: string
  status: "in-stock" | "low-stock" | "out-of-stock" | "expired"
  lastUpdated: string
  useCases: string[] // Added useCases field
}

interface InventoryPageProps {
  userRole: "admin" | "pharma"
}

export default function InventoryPage({ userRole }: InventoryPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSort, setSelectedSort] = useState("az") // New: sort state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAlpha, setSelectedAlpha] = useState<string | null>(null)
  const alphaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Enhanced mock inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Analgesic",
      supplier: "MedSupply Co.",
      quantity: 500,
      minStock: 100,
      unitPrice: 0.5,
      expiryDate: "2024-12-31",
      batchNumber: "PAR001",
      status: "in-stock",
      lastUpdated: "2024-01-15",
      useCases: ["fever", "headache", "pain relief"],
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      supplier: "PharmaCorp",
      quantity: 75,
      minStock: 150,
      unitPrice: 1.2,
      expiryDate: "2024-11-15",
      batchNumber: "AMX002",
      status: "low-stock",
      lastUpdated: "2024-01-14",
      useCases: ["infection", "bacterial infection", "respiratory infection"],
    },
    {
      id: "3",
      name: "Insulin Glargine",
      category: "Diabetes",
      supplier: "Global Pharma",
      quantity: 0,
      minStock: 50,
      unitPrice: 25.0,
      expiryDate: "2024-10-31",
      batchNumber: "INS003",
      status: "out-of-stock",
      lastUpdated: "2024-01-13",
      useCases: ["diabetes", "blood sugar control"],
    },
    {
      id: "4",
      name: "Aspirin 75mg",
      category: "Cardiovascular",
      supplier: "HealthMeds Ltd.",
      quantity: 200,
      minStock: 100,
      unitPrice: 0.3,
      expiryDate: "2024-02-15",
      batchNumber: "ASP004",
      status: "expired",
      lastUpdated: "2024-01-12",
      useCases: ["pain relief", "anti-inflammatory", "heart attack prevention"],
    },
    {
      id: "5",
      name: "Metformin 500mg",
      category: "Diabetes",
      supplier: "MedSupply Co.",
      quantity: 300,
      minStock: 200,
      unitPrice: 0.8,
      expiryDate: "2025-06-30",
      batchNumber: "MET005",
      status: "in-stock",
      lastUpdated: "2024-01-16",
      useCases: ["diabetes", "blood sugar control", "PCOS"],
    },
    {
      id: "6",
      name: "Lisinopril 10mg",
      category: "Cardiovascular",
      supplier: "PharmaCorp",
      quantity: 120,
      minStock: 200,
      unitPrice: 1.5,
      expiryDate: "2024-09-20",
      batchNumber: "LIS006",
      status: "low-stock",
      lastUpdated: "2024-01-11",
      useCases: ["hypertension", "heart failure"],
    },
  ])

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    supplier: "",
    quantity: "",
    minStock: "",
    unitPrice: "",
    expiryDate: "",
    batchNumber: "",
    notes: "",
  })

  const categories = ["Analgesic", "Antibiotic", "Diabetes", "Cardiovascular", "Vaccine", "Dermatology", "Respiratory"]
  const suppliers = ["MedSupply Co.", "PharmaCorp", "Global Pharma", "HealthMeds Ltd.", "BioMed Inc."]

  // Filter and sort logic
  const filteredInventory = inventory
    .filter((item) => {
      // Search by name or use-case
      const search = searchTerm.toLowerCase()
      const matchesName = item.name.toLowerCase().includes(search)
      const matchesUseCase = item.useCases.some((uc) => uc.toLowerCase().includes(search))
      const matchesSearch = matchesName || matchesUseCase
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (selectedSort === "az") {
        return a.name.localeCompare(b.name)
      } else if (selectedSort === "expiry") {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      } else if (selectedSort === "stock") {
        return b.quantity - a.quantity
      }
      return 0
    })

  // Group filtered inventory by first letter
  const alphaGroups: { [key: string]: InventoryItem[] } = {}
  if (selectedSort === "az") {
    filteredInventory.forEach(item => {
      const letter = item.name[0].toUpperCase()
      if (!alphaGroups[letter]) alphaGroups[letter] = []
      alphaGroups[letter].push(item)
    })
  }

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

  // On first render, expand the first group with medicines
  useEffect(() => {
    if (selectedSort === "az" && Object.keys(alphaGroups).length > 0) {
      const firstLetter = alphabet.find(l => alphaGroups[l])
      if (firstLetter) {
        setSelectedAlpha(firstLetter)
      }
    }
  }, [selectedSort, searchTerm, categoryFilter, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "out-of-stock":
        return "bg-red-100 text-red-800 border-red-200"
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Package className="h-4 w-4 text-green-600" />
      case "low-stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "out-of-stock":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "expired":
        return <Calendar className="h-4 w-4 text-gray-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      supplier: newItem.supplier,
      quantity: Number.parseInt(newItem.quantity),
      minStock: Number.parseInt(newItem.minStock),
      unitPrice: Number.parseFloat(newItem.unitPrice),
      expiryDate: newItem.expiryDate,
      batchNumber: newItem.batchNumber,
      status: Number.parseInt(newItem.quantity) > Number.parseInt(newItem.minStock) ? "in-stock" : "low-stock",
      lastUpdated: new Date().toISOString().split("T")[0],
      useCases: [], // Initialize useCases as an empty array
    }

    setInventory([...inventory, item])
    setNewItem({
      name: "",
      category: "",
      supplier: "",
      quantity: "",
      minStock: "",
      unitPrice: "",
      expiryDate: "",
      batchNumber: "",
      notes: "",
    })
    setIsAddModalOpen(false)
  }

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + item.quantity * item.unitPrice, 0).toFixed(2)
  }

  const getLowStockCount = () => {
    return inventory.filter((item) => item.status === "low-stock" || item.status === "out-of-stock").length
  }

  const getExpiringCount = () => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return inventory.filter((item) => new Date(item.expiryDate) <= thirtyDaysFromNow).length
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Management</h2>
          <p className="text-muted-foreground mt-2">
            {userRole === "admin"
              ? "Complete inventory oversight and management"
              : "Medicine inventory and stock monitoring"}
          </p>
        </div>
        {userRole === "pharma" && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <AnimatedButton>
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </AnimatedButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Add New Medicine to Inventory
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 form-field">
                  <Label htmlFor="name">Medicine Name *</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Paracetamol 500mg"
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select
                    value={newItem.supplier}
                    onValueChange={(value) => setNewItem({ ...newItem, supplier: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="batchNumber">Batch Number *</Label>
                  <Input
                    id="batchNumber"
                    value={newItem.batchNumber}
                    onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                    placeholder="e.g., PAR001"
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="quantity">Current Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="minStock">Minimum Stock Level *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                    placeholder="Enter minimum stock"
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                    placeholder="Enter unit price"
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 form-field">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="col-span-2 space-y-2 form-field">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Enter any additional notes or special instructions"
                    className="border-gray-300 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  Add to Inventory
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Items</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{inventory.length}</div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Active medicine items</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Stock Alerts</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{getLowStockCount()}</div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiring Soon</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{getExpiringCount()}</div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Within 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Value</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{getTotalValue()}</div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 dark:text-gray-500" />
          <Input
            placeholder="Search medicines, use-cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px] border-gray-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="dark:text-gray-300 dark:hover:bg-gray-700">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-gray-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Status</SelectItem>
            <SelectItem value="in-stock" className="dark:text-gray-300 dark:hover:bg-gray-700">In Stock</SelectItem>
            <SelectItem value="low-stock" className="dark:text-gray-300 dark:hover:bg-gray-700">Low Stock</SelectItem>
            <SelectItem value="out-of-stock" className="dark:text-gray-300 dark:hover:bg-gray-700">Out of Stock</SelectItem>
            <SelectItem value="expired" className="dark:text-gray-300 dark:hover:bg-gray-700">Expired</SelectItem>
          </SelectContent>
        </Select>
        {/* Sort Dropdown */}
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className="w-[180px] border-gray-300 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <ChevronDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="az" className="dark:text-gray-300 dark:hover:bg-gray-700">Alphabetical A–Z</SelectItem>
            <SelectItem value="expiry" className="dark:text-gray-300 dark:hover:bg-gray-700">Expiry Date</SelectItem>
            <SelectItem value="stock" className="dark:text-gray-300 dark:hover:bg-gray-700">Stock Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Inventory Grid */}
      <div className="flex">
        {/* Alphabet Bar (only for A–Z sort) */}
        {selectedSort === "az" && (
          <div className="sticky top-24 z-10 flex flex-col items-center mr-4 h-fit bg-white/90 rounded-xl shadow p-2 border border-blue-200 dark:bg-gray-800/90 dark:border-gray-600">
            {alphabet.map(letter => (
              <button
                key={letter}
                className={`w-8 h-8 my-0.5 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200
                  ${selectedAlpha === letter ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg scale-110 ring-2 ring-cyan-300' : alphaGroups[letter] ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40' : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'}`}
                disabled={!alphaGroups[letter]}
                onClick={() => {
                  setSelectedAlpha(letter)
                  if (alphaRefs.current[letter]) {
                    alphaRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                aria-label={`Show medicines starting with ${letter}`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
        {/* Inventory Grid (grouped by letter if alpha sort) */}
        <div className="flex-1">
          {selectedSort === "az" ? (
            <div>
              {alphabet.map(letter => (
                alphaGroups[letter] ? (
                  <div key={letter} ref={el => { alphaRefs.current[letter] = el }} className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl font-bold drop-shadow-sm transition-colors duration-200 ${selectedAlpha === letter ? 'text-blue-700' : 'text-gray-400'}`}>{letter}</span>
                      <span className="text-gray-400 text-sm">({alphaGroups[letter].length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {alphaGroups[letter].map((item, index) => (
                        <Card
                          key={item.id}
                          className="card-hover stagger-item border-0 shadow-md bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-cyan-50 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center dark:from-blue-900/20 dark:to-cyan-900/20">
                                  {getStatusIcon(item.status)}
                                </div>
                                <div>
                                  <CardTitle className="text-lg text-gray-900 dark:text-white">{item.name}</CardTitle>
                                  <CardDescription className="text-gray-600 dark:text-gray-400">{item.category}</CardDescription>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(item.status)} border font-medium w-fit`}>
                                {item.status.replace("-", " ")}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <Package className="mr-2 h-4 w-4" />
                                  <span>
                                    Qty: <strong className="text-gray-900 dark:text-white">{item.quantity}</strong>
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <IndianRupee className="mr-2 h-4 w-4" />
                                  <span>₹{item.unitPrice}</span>
                                </div>
                              </div>

                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Expires: {item.expiryDate}</span>
                              </div>

                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Truck className="mr-2 h-4 w-4" />
                                <span>{item.supplier}</span>
                              </div>

                              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">Batch: {item.batchNumber}</span>
                                  <span className="text-gray-500 dark:text-gray-400">Updated: {item.lastUpdated}</span>
                                </div>
                              </div>

                              {/* Stock Level Indicator */}
                              <div className="pt-2">
                                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <span>Stock Level</span>
                                  <span>
                                    {item.quantity}/{item.minStock}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 progress-bar dark:bg-gray-600">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      item.quantity > item.minStock
                                        ? "bg-green-500"
                                        : item.quantity > 0
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                    }`}
                                    style={{ width: `${Math.min((item.quantity / item.minStock) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-4">
                              <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                                    onClick={() => setSelectedItem(item)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Package className="h-5 w-5 text-blue-600" />
                                      Medicine Details
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedItem && (
                                    <div className="space-y-6">
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                          {getStatusIcon(selectedItem.status)}
                                        </div>
                                        <div>
                                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedItem.name}</h3>
                                          <p className="text-gray-600">Category: {selectedItem.category}</p>
                                          <Badge className={`${getStatusColor(selectedItem.status)} border font-medium mt-2 w-fit`}>
                                            {selectedItem.status.replace("-", " ")}
                                          </Badge>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <h4 className="font-semibold text-lg text-gray-900">Stock Information</h4>
                                          <div className="space-y-3">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <label className="text-sm font-medium text-gray-500">Current Quantity</label>
                                              <p className="text-xl font-bold text-gray-900">{selectedItem.quantity}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <label className="text-sm font-medium text-gray-500">Minimum Stock</label>
                                              <p className="text-lg font-semibold text-gray-700">{selectedItem.minStock}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <label className="text-sm font-medium text-gray-500">Unit Price</label>
                                              <p className="text-lg font-semibold text-green-600">₹{selectedItem.unitPrice}</p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <h4 className="font-semibold text-lg text-gray-900">Product Details</h4>
                                          <div className="space-y-3">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <label className="text-sm font-medium text-gray-500">Supplier</label>
                                              <p className="text-lg font-semibold text-gray-700">{selectedItem.supplier}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <label className="text-sm font-medium text-gray-500">Batch Number</label>
                                              <p className="text-lg font-mono text-gray-700">{selectedItem.batchNumber}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                                              <p className="text-lg font-semibold text-gray-700">{selectedItem.expiryDate}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-blue-900 mb-2">Stock Analysis</h4>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                          <div>
                                            <p className="text-2xl font-bold text-blue-600">
                                              ₹{(selectedItem.quantity * selectedItem.unitPrice).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-blue-700">Total Value</p>
                                          </div>
                                          <div>
                                            <p className="text-2xl font-bold text-blue-600">
                                              {Math.round((selectedItem.quantity / selectedItem.minStock) * 100)}%
                                            </p>
                                            <p className="text-sm text-blue-700">Stock Level</p>
                                          </div>
                                          <div>
                                            <p className="text-2xl font-bold text-blue-600">
                                              {Math.ceil(
                                                Math.abs(new Date(selectedItem.expiryDate).getTime() - new Date().getTime()) /
                                                  (1000 * 3600 * 24),
                                              )}
                                            </p>
                                            <p className="text-sm text-blue-700">Days to Expiry</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {userRole === "pharma" && (
                              <Button
                                  variant="default"
                                size="sm"
                                className="w-full sm:flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow hover:from-blue-500 hover:to-green-400"
                                onClick={() => alert(`Restock action for ${item.name}`)}
                              >
                                Restock
                              </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item, index) => (
                <Card
                  key={item.id}
                  className="card-hover stagger-item border-0 shadow-md bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-cyan-50 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center dark:from-blue-900/20 dark:to-cyan-900/20">
                          {getStatusIcon(item.status)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">{item.name}</CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">{item.category}</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(item.status)} border font-medium w-fit`}>
                        {item.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Package className="mr-2 h-4 w-4" />
                          <span>
                            Qty: <strong className="text-gray-900 dark:text-white">{item.quantity}</strong>
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <IndianRupee className="mr-2 h-4 w-4" />
                          <span>₹{item.unitPrice}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Expires: {item.expiryDate}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Truck className="mr-2 h-4 w-4" />
                        <span>{item.supplier}</span>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Batch: {item.batchNumber}</span>
                          <span className="text-gray-500 dark:text-gray-400">Updated: {item.lastUpdated}</span>
                        </div>
                      </div>

                      {/* Stock Level Indicator */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Stock Level</span>
                          <span>
                            {item.quantity}/{item.minStock}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 progress-bar dark:bg-gray-600">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.quantity > item.minStock
                                ? "bg-green-500"
                                : item.quantity > 0
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min((item.quantity / item.minStock) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Package className="h-5 w-5 text-blue-600" />
                              Medicine Details
                            </DialogTitle>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="space-y-6">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                                  {getStatusIcon(selectedItem.status)}
                                </div>
                                <div>
                                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedItem.name}</h3>
                                  <p className="text-gray-600">Category: {selectedItem.category}</p>
                                  <Badge className={`${getStatusColor(selectedItem.status)} border font-medium mt-2 w-fit`}>
                                    {selectedItem.status.replace("-", " ")}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-lg text-gray-900">Stock Information</h4>
                                  <div className="space-y-3">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <label className="text-sm font-medium text-gray-500">Current Quantity</label>
                                      <p className="text-xl font-bold text-gray-900">{selectedItem.quantity}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <label className="text-sm font-medium text-gray-500">Minimum Stock</label>
                                      <p className="text-lg font-semibold text-gray-700">{selectedItem.minStock}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <label className="text-sm font-medium text-gray-500">Unit Price</label>
                                      <p className="text-lg font-semibold text-green-600">₹{selectedItem.unitPrice}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold text-lg text-gray-900">Product Details</h4>
                                  <div className="space-y-3">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <label className="text-sm font-medium text-gray-500">Supplier</label>
                                      <p className="text-lg font-semibold text-gray-700">{selectedItem.supplier}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <label className="text-sm font-medium text-gray-500">Batch Number</label>
                                      <p className="text-lg font-mono text-gray-700">{selectedItem.batchNumber}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                                      <p className="text-lg font-semibold text-gray-700">{selectedItem.expiryDate}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-2">Stock Analysis</h4>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                      ₹{(selectedItem.quantity * selectedItem.unitPrice).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-blue-700">Total Value</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                      {Math.round((selectedItem.quantity / selectedItem.minStock) * 100)}%
                                    </p>
                                    <p className="text-sm text-blue-700">Stock Level</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-blue-600">
                                      {Math.ceil(
                                        Math.abs(new Date(selectedItem.expiryDate).getTime() - new Date().getTime()) /
                                          (1000 * 3600 * 24),
                                      )}
                                    </p>
                                    <p className="text-sm text-blue-700">Days to Expiry</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {userRole === "pharma" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
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
          )}
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : "Get started by adding medicines to your inventory."}
          </p>
          {userRole === "pharma" && (
            <AnimatedButton className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="mr-2 h-4 w-4" />
              Add First Medicine
            </AnimatedButton>
          )}
        </div>
      )}
    </div>
  )
}
