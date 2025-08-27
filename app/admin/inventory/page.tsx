"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Package, Plus, Minus, Search, Download } from "lucide-react"
import { toast } from "sonner"

interface InventoryItem {
  id: string
  name: string
  sku: string
  stock_quantity: number
  low_stock_threshold: number
  price: number
  category: string
  last_updated: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [adjustments, setAdjustments] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/admin/inventory")
      if (response.ok) {
        const data = await response.json()
        setInventory(data.inventory || [])
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast.error("Failed to fetch inventory")
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (productId: string, adjustment: number) => {
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, adjustment }),
      })

      if (response.ok) {
        toast.success("Stock updated successfully")
        fetchInventory()
        setAdjustments((prev) => ({ ...prev, [productId]: 0 }))
      } else {
        throw new Error("Failed to update stock")
      }
    } catch (error) {
      console.error("Error updating stock:", error)
      toast.error("Failed to update stock")
    }
  }

  const exportInventory = async () => {
    try {
      const response = await fetch("/api/admin/inventory/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Inventory exported successfully")
      }
    } catch (error) {
      console.error("Error exporting inventory:", error)
      toast.error("Failed to export inventory")
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const lowStockItems = inventory.filter((item) => item.stock_quantity <= item.low_stock_threshold)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="h-12 w-12 text-luxury-gold mx-auto mb-4 animate-pulse" />
          <p className="text-luxury-charcoal">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-luxury-navy font-playfair">Inventory Management</h1>
          <p className="text-luxury-charcoal mt-2">Track and manage product stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportInventory}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert ({lowStockItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.slice(0, 6).map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-orange-800">{item.name}</p>
                    <p className="text-sm text-orange-600">SKU: {item.sku}</p>
                  </div>
                  <Badge className="bg-orange-500 text-white">{item.stock_quantity} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="card-luxury">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal h-4 w-4" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>Inventory ({filteredInventory.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Low Stock Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stock Adjustment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span
                        className={
                          item.stock_quantity <= item.low_stock_threshold ? "text-orange-600 font-semibold" : ""
                        }
                      >
                        {item.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>{item.low_stock_threshold}</TableCell>
                    <TableCell>
                      {item.stock_quantity <= item.low_stock_threshold ? (
                        <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>
                      ) : item.stock_quantity === 0 ? (
                        <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAdjustments((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) - 1 }))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={adjustments[item.id] || 0}
                          onChange={(e) =>
                            setAdjustments((prev) => ({ ...prev, [item.id]: Number.parseInt(e.target.value) || 0 }))
                          }
                          className="w-20 text-center"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAdjustments((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => updateStock(item.id, adjustments[item.id] || 0)}
                        disabled={!adjustments[item.id]}
                        className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90"
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
