//
// drops/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// scheduled drops management page
//

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Clock, Package, Edit, Trash2, Eye } from 'lucide-react'
import { Drop, Product } from '@/lib/types/drop'
import DropModal from './DropModal'
import { PageLoader } from '@/components/ui/loader'

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingDrop, setEditingDrop] = useState<Drop | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Load drops and available products on mount
  useEffect(() => {
    loadDrops()
    loadAvailableProducts()
  }, [])

  const loadDrops = async () => {
    try {
      const response = await fetch('/api/drops')
      if (response.ok) {
        const dropsData = await response.json()
        setDrops(dropsData)
      } else {
        console.error('Failed to load drops')
      }
    } catch (error) {
      console.error('Error loading drops:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAvailableProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const products = await response.json()
        // Filter to only show draft products that aren't in any drop
        const available = products.filter((p: Product) => 
          p.status === 'draft' && !p.drop_id
        )
        setAvailableProducts(available)
      } else {
        console.error('Failed to load available products')
      }
    } catch (error) {
      console.error('Error loading available products:', error)
    }
  }

  const handleAdd = (newDrop: Drop) => {
    setDrops([newDrop, ...drops])
    // Refresh available products since some may have been added to the drop
    loadAvailableProducts()
  }

  const handleEdit = (drop: Drop) => {
    setEditingDrop(drop)
    setEditModalOpen(true)
  }

  const handleDropUpdated = (updatedDrop: Drop) => {
    setDrops(drops.map(d => d.id === updatedDrop.id ? updatedDrop : d))
    // Refresh available products
    loadAvailableProducts()
  }

  const deleteDrop = async (drop: Drop) => {
    if (!drop.id) return
    
    try {
      await fetch(`/api/drops/${drop.id}`, {
        method: 'DELETE',
      })
      setDrops(drops.filter(d => d.id !== drop.id))
      // Refresh available products since products were removed from the drop
      loadAvailableProducts()
    } catch (error) {
      console.error('Error deleting drop:', error)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'live':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Drops</h1>
          <p className="text-muted-foreground">
            Manage your product drops and release schedules
          </p>
        </div>
        <DropModal
          mode="add"
          availableProducts={availableProducts}
          onDropAdded={handleAdd}
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Drop
            </Button>
          }
        />
      </div>

      {/* Drops Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drops.map((drop) => (
          <Card key={drop.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{drop.title}</h3>
                  {drop.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {drop.description}
                    </p>
                  )}
                </div>
                
                {/* Meta */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(drop.scheduled_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{drop.products?.length || 0} products</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(drop.status)}`}>
                      {drop.status}
                    </span>
                  </div>
                </div>
                
                {/* Products Preview */}
                {drop.products && drop.products.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Products:</p>
                    <div className="flex flex-wrap gap-1">
                      {drop.products.slice(0, 3).map((product) => (
                        <span
                          key={product.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {product.name}
                        </span>
                      ))}
                      {drop.products.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{drop.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(drop)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDrop(drop)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty State */}
      {drops.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Calendar className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No drops scheduled yet</h3>
                <p className="text-gray-500">Create your first drop to start scheduling product releases.</p>
              </div>
              <DropModal
                mode="add"
                availableProducts={availableProducts}
                onDropAdded={handleAdd}
                trigger={
                  <Button className="flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />
                    New Drop
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <DropModal
        mode="edit"
        drop={editingDrop}
        availableProducts={availableProducts}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onDropUpdated={handleDropUpdated}
      />
    </div>
  )
} 