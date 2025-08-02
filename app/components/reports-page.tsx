import React, { useState, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import jsPDF from "jspdf" // @ts-ignore: no types
import html2canvas from "html2canvas" // @ts-ignore: no types

interface ProfitLossRow {
  date: string // changed from dateRange
  totalRevenue: number
  totalExpenses: number
  notes: string
  groupKey?: string // for grouping
}

const initialRows: ProfitLossRow[] = [
  { date: "2024-01-01", totalRevenue: 10000, totalExpenses: 7000, notes: "High" },
  { date: "2024-01-02", totalRevenue: 12000, totalExpenses: 8000, notes: "Steady growth" },
  { date: "2024-01-03", totalRevenue: 9000, totalExpenses: 9500, notes: "Slight loss" },
  { date: "2024-01-04", totalRevenue: 15000, totalExpenses: 6000, notes: "High profit day" },
  { date: "2024-01-05", totalRevenue: 11000, totalExpenses: 11000, notes: "Break even" },
]

const GROUP_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const ReportsPage: React.FC = () => {
  const [rows, setRows] = useState<ProfitLossRow[]>(initialRows)
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [groupBy, setGroupBy] = useState("day")
  const tableRef = useRef<HTMLDivElement>(null)

  // Get all years from data for the year dropdown
  const allYears = Array.from(new Set(rows.map(r => r.date.slice(0, 4)))).sort()
  // For year dropdown, show 2020-2030
  const YEAR_RANGE = Array.from({ length: 11 }, (_, i) => (2020 + i).toString())
  // Use YEAR_RANGE for year dropdown
  const [selectedYear, setSelectedYear] = useState(YEAR_RANGE.includes(new Date().getFullYear().toString()) ? new Date().getFullYear().toString() : YEAR_RANGE[0])

  // Filter rows by date range
  const filteredRows = rows.filter(row => {
    if (!dateFilter.from && !dateFilter.to) return true
    const rowDate = row.date
    if (dateFilter.from && rowDate < dateFilter.from) return false
    if (dateFilter.to && rowDate > dateFilter.to) return false
    return true
  })

  // Grouping logic
  function getGroupedRows(rows: ProfitLossRow[], groupBy: string): ProfitLossRow[] {
    if (groupBy === "day") return rows.map(row => ({ ...row, groupKey: row.date }))
    if (groupBy === "month") {
      // Always show all 12 months for selectedYear (2020-2030)
      const months: ProfitLossRow[] = []
      for (let m = 0; m < 12; m++) {
        const monthStr = `${selectedYear}-${(m + 1).toString().padStart(2, "0")}`
        const monthRows = rows.filter(r => r.date.startsWith(monthStr))
        const totalRevenue = monthRows.reduce((sum, r) => sum + Number(r.totalRevenue), 0)
        const totalExpenses = monthRows.reduce((sum, r) => sum + Number(r.totalExpenses), 0)
        months.push({
          date: monthStr,
          totalRevenue,
          totalExpenses,
          notes: "",
          groupKey: monthStr,
        })
      }
      return months
    }
    if (groupBy === "year") {
      // Always show all years from 2020 to 2030
      return YEAR_RANGE.map(year => {
        const yearRows = rows.filter(r => r.date.startsWith(year))
        const totalRevenue = yearRows.reduce((sum, r) => sum + Number(r.totalRevenue), 0)
        const totalExpenses = yearRows.reduce((sum, r) => sum + Number(r.totalExpenses), 0)
        return {
          date: year,
          totalRevenue,
          totalExpenses,
          notes: "",
          groupKey: year,
        }
      })
    }
    return []
  }
  const groupedRows = getGroupedRows(filteredRows, groupBy)

  const handleRowChange = (index: number, field: keyof ProfitLossRow, value: string | number) => {
    setRows((prev) => {
      const updated = [...prev]
      // @ts-ignore
      updated[index][field] = field === "totalRevenue" || field === "totalExpenses" ? Number(value) : value
      return updated
    })
  }

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { date: "", totalRevenue: 0, totalExpenses: 0, notes: "" },
    ])
  }

  const exportCSV = () => {
    const header = ["Date", "Total Revenue (₹)", "Total Expenses (₹)", "Net Profit/Loss (₹)", "Notes"]
    const csvRows = rows.map(row => [
      row.date,
      `₹${row.totalRevenue}`,
      `₹${row.totalExpenses}`,
      `₹${row.totalRevenue - row.totalExpenses}`,
      row.notes
    ])
    const csvContent = [header, ...csvRows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "profit_loss_report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = async () => {
    if (!tableRef.current) return
    const canvas = await html2canvas(tableRef.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "landscape" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pageWidth
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight)
    pdf.save("profit_loss_report.pdf")
  }

  // Calculate summary totals for visible rows
  const totalRevenue = filteredRows.reduce((sum, row) => sum + Number(row.totalRevenue), 0)
  const totalExpenses = filteredRows.reduce((sum, row) => sum + Number(row.totalExpenses), 0)
  const totalNet = totalRevenue - totalExpenses

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Card className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Profit & Loss Report</CardTitle>
            <div className="flex items-center gap-2">
              <label htmlFor="groupBy" className="text-sm font-medium text-gray-600 dark:text-gray-400">Group by:</label>
              <select
                id="groupBy"
                value={groupBy}
                onChange={e => setGroupBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 text-sm transition-all dark:bg-gray-700 dark:text-white"
              >
                {GROUP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="dark:bg-gray-700">{opt.label}</option>
                ))}
              </select>
              {groupBy === "month" && (
                <>
                  <label htmlFor="yearSelect" className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-4">Year:</label>
                  <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 text-sm transition-all dark:bg-gray-700 dark:text-white"
                  >
                    {YEAR_RANGE.map(y => (
                      <option key={y} value={y} className="dark:bg-gray-700">{y}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 text-sm transition-all dark:bg-gray-700 dark:text-white w-full sm:w-auto"
                  value={dateFilter.from}
                  onChange={e => setDateFilter(f => ({ ...f, from: e.target.value }))}
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 text-sm transition-all dark:bg-gray-700 dark:text-white w-full sm:w-auto"
                  value={dateFilter.to}
                  onChange={e => setDateFilter(f => ({ ...f, to: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={() => setDateFilter({ from: "", to: "" })} className="rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all dark:text-gray-300 w-full sm:w-auto">Clear</Button>
              <Button onClick={addRow} variant="outline" className="rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all dark:text-gray-300 w-full sm:w-auto">Add Row</Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={exportCSV} variant="secondary" className="rounded-lg px-4 py-2 border border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-900 dark:hover:text-blue-300 transition-all w-full sm:w-auto">Export to CSV</Button>
              <Button onClick={exportPDF} variant="secondary" className="rounded-lg px-4 py-2 border border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-900 dark:hover:text-purple-300 transition-all w-full sm:w-auto">Export to PDF</Button>
            </div>
          </div>
          <div className="overflow-x-auto" ref={tableRef}>
            <Table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHead className="font-semibold text-gray-700 dark:text-white px-4 py-3">
                    {groupBy === "month" ? "Month" : groupBy === "year" ? "Year" : "Date"}
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-white px-4 py-3">Total Revenue</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-white px-4 py-3">Total Expenses</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-white px-4 py-3">Net Profit/Loss</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-white px-4 py-3">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedRows.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group">
                    <TableCell className="px-4 py-2 dark:text-white">
                      {groupBy === "month" ? MONTH_NAMES[parseInt(row.date.slice(5, 7)) - 1] : groupBy === "year" ? row.date : row.date}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="number"
                          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-400 text-sm w-32 transition-all pr-8 dark:bg-gray-700 dark:text-white"
                          value={row.totalRevenue}
                          onChange={e => {
                            // Remove leading zeros
                            const value = e.target.value.replace(/^0+(?=\d)/, "");
                            handleRowChange(idx, "totalRevenue", value);
                          }}
                          min={0}
                          style={{ width: '100%' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            right: '0.75em',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#16a34a',
                            pointerEvents: 'none',
                            fontWeight: 600,
                          }}
                        >
                          ₹
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="number"
                          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-400 text-sm w-32 transition-all pr-8 dark:bg-gray-700 dark:text-white"
                          value={row.totalExpenses}
                          onChange={e => {
                            // Remove leading zeros
                            const value = e.target.value.replace(/^0+(?=\d)/, "");
                            handleRowChange(idx, "totalExpenses", value);
                          }}
                          min={0}
                          style={{ width: '100%' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            right: '0.75em',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#dc2626',
                            pointerEvents: 'none',
                            fontWeight: 600,
                          }}
                        >
                          ₹
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className={
                      row.totalRevenue - row.totalExpenses > 0
                        ? "px-4 py-2 text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/50"
                        : row.totalRevenue - row.totalExpenses < 0
                        ? "px-4 py-2 text-red-700 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/50"
                        : "px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600"
                    }>
                      ₹{row.totalRevenue - row.totalExpenses}
                      {row.totalRevenue - row.totalExpenses > 0 && <span className="ml-1" title="Profit">📈</span>}
                      {row.totalRevenue - row.totalExpenses < 0 && <span className="ml-1" title="Loss">📉</span>}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 text-sm w-48 transition-all dark:bg-gray-700 dark:text-white"
                        value={row.notes}
                        onChange={e => handleRowChange(idx, "notes", e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* Summary Row */}
              <tfoot>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableCell className="font-bold px-4 py-2 dark:text-white">Total</TableCell>
                  <TableCell className="font-bold px-4 py-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30">₹{totalRevenue}</TableCell>
                  <TableCell className="font-bold px-4 py-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30">₹{totalExpenses}</TableCell>
                  <TableCell className={
                    totalNet > 0
                      ? "font-bold px-4 py-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                      : totalNet < 0
                      ? "font-bold px-4 py-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
                      : "font-bold px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
                  }>
                    ₹{totalNet}
                  </TableCell>
                  <TableCell className="px-4 py-2" />
                </TableRow>
              </tfoot>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsPage 