//
// drops/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// scheduled drops management page with tabs
//

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Clock, Package, Edit, Trash2, Eye, Mail, BarChart3 } from 'lucide-react'
import { Drop, Product } from '@/lib/types/drop'
import { PageLoader } from '@/components/ui/loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'new-drop' | 'email-templates'>('overview')
  
  // New drop form state
  const [newDropForm, setNewDropForm] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'completed' | 'cancelled',
    product_ids: [] as string[]
  })
  const [isCreatingDrop, setIsCreatingDrop] = useState(false)
  const [productSearch, setProductSearch] = useState('')

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

  const handleCreateDrop = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingDrop(true)

    try {
      const response = await fetch('/api/drops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDropForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create drop')
      }

      const result = await response.json()
      setDrops([result, ...drops])
      
      // Reset form
      setNewDropForm({
        title: '',
        description: '',
        scheduled_at: '',
        status: 'scheduled',
        product_ids: []
      })
      
      // Switch to overview tab
      setActiveTab('overview')
      
      // Refresh available products
      loadAvailableProducts()
    } catch (error) {
      console.error('Error creating drop:', error)
      alert(error instanceof Error ? error.message : 'Failed to create drop')
    } finally {
      setIsCreatingDrop(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setNewDropForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProductToggle = (productId: string, checked: boolean) => {
    setNewDropForm(prev => ({
      ...prev,
      product_ids: checked 
        ? [...prev.product_ids, productId]
        : prev.product_ids.filter(id => id !== productId)
    }))
  }

  // Filter products based on search
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category?.toLowerCase().includes(productSearch.toLowerCase())
  )

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
    return <PageLoader />
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheduled Drops</h1>
        <p className="text-muted-foreground">
          Manage your product drops and release schedules
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
          className="flex items-center"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Overview</span>
        </Button>
        <Button
          variant={activeTab === 'new-drop' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('new-drop')}
          className="flex items-center"
        >
          <Plus className="h-4 w-4" />
          <span>New Drop</span>
        </Button>
        <Button
          variant={activeTab === 'email-templates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('email-templates')}
          className="flex items-center"
        >
          <Mail className="h-4 w-4" />
          <span>Email Templates</span>
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
                        onClick={() => deleteDrop(drop)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
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
                  <Button 
                    onClick={() => setActiveTab('new-drop')}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    New Drop
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'new-drop' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleCreateDrop} className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Drop Title *</Label>
                    <Input
                      id="title"
                      value={newDropForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter drop title"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newDropForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter drop description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="scheduled_at">Scheduled Date & Time *</Label>
                    <Input
                      id="scheduled_at"
                      type="datetime-local"
                      value={newDropForm.scheduled_at}
                      onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Select Products</Label>
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={filteredProducts.length > 0 && filteredProducts.every(p => newDropForm.product_ids.includes(p.id))}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleInputChange('product_ids', [...new Set([...newDropForm.product_ids, ...filteredProducts.map(p => p.id)])])
                                } else {
                                  handleInputChange('product_ids', newDropForm.product_ids.filter(id => !filteredProducts.some(p => p.id === id)))
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Images</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Checkbox
                                checked={newDropForm.product_ids.includes(product.id)}
                                onCheckedChange={(checked) => 
                                  handleProductToggle(product.id, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {product.images && product.images.length > 0 ? (
                                <div className="flex space-x-1">
                                  {product.images.slice(0, 3).map((image, index) => (
                                    <div key={index} className="w-8 h-8 rounded border overflow-hidden flex-shrink-0">
                                      <Image
                                        src={image}
                                        alt={`Product image ${index + 1}`}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {product.images.length > 3 && (
                                    <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                      +{product.images.length - 3}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              {product.category ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {product.category}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-sm">No category</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              <div className="space-y-2">
                                <Package className="w-8 h-8 mx-auto text-gray-400" />
                                <p className="text-sm">
                                  {productSearch ? 'No products found matching your search.' : 'No draft products available'}
                                </p>
                                <p className="text-xs">
                                  {productSearch ? 'Try adjusting your search terms.' : 'Create draft products in Inventory to add them to drops'}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {newDropForm.product_ids.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {newDropForm.product_ids.length} product{newDropForm.product_ids.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('overview')}
                    disabled={isCreatingDrop}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreatingDrop || !newDropForm.title || !newDropForm.scheduled_at}
                  >
                    {isCreatingDrop ? 'Creating...' : 'Create Drop'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'email-templates' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Email Templates</h3>
                  <p className="text-muted-foreground">
                    Create and manage email templates for drop marketing campaigns
                  </p>
                </div>
                
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-medium mb-2">Email Templates Coming Soon</h4>
                  <p className="text-sm">
                    We're working on email template functionality for your drop marketing campaigns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 