//
// ProductModal.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// product modal component for adding/editing products
//

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Product } from '@/lib/types/product'
import ImageUpload from './ImageUpload'
import { Plus } from 'lucide-react'

interface ProductModalProps {
  mode: 'add' | 'edit';
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProductAdded?: (product: Product) => void;
  onProductUpdated?: (product: Product) => void;
  trigger?: React.ReactNode;
}

export default function ProductModal({ 
  mode,
  product,
  open,
  onOpenChange,
  onProductAdded,
  onProductUpdated,
  trigger
}: ProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    status: 'draft' as 'draft' | 'scheduled' | 'live' | 'sold' | 'archived',
    images: [] as string[]
  });

  // Use controlled or uncontrolled open state
  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;

  // Update form data when product changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        status: product.status,
        images: product.images
      });
    } else if (mode === 'add') {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        status: 'draft',
        images: []
      });
    }
  }, [mode, product]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === 'add' ? '/api/products' : `/api/products/${product?.id}`;
      const method = mode === 'add' ? 'POST' : 'PATCH';

      const requestBody = mode === 'add' 
        ? { ...formData, status: 'draft' } // Always set to draft for new products
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${mode} product`);
      }

      const result = await response.json();
      
      if (mode === 'add' && onProductAdded) {
        onProductAdded(result);
      } else if (mode === 'edit' && onProductUpdated) {
        onProductUpdated(result);
      }

      setModalOpen(false);
    } catch (error) {
      console.error(`Error ${mode}ing product:`, error);
      alert(error instanceof Error ? error.message : `Failed to ${mode} product`);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Product' : 'Add New Product';
  const description = isEditMode ? 'Update the product details below.' : 'Fill out the details below to create a new product.';
  const submitText = isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product');

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (in cents) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>
            {isEditMode && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value as 'draft' | 'scheduled' | 'live' | 'sold' | 'archived')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <ImageUpload
              images={formData.images}
              onChange={(images) => handleInputChange('images', images)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 