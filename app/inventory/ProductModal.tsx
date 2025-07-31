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
import { Product, ProductSettings } from '@/lib/types/product'
import ImageUpload from './ImageUpload'
import { Plus, X } from 'lucide-react'

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
  const [productSettings, setProductSettings] = useState<ProductSettings | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0, // stored in cents
    priceDisplay: '', // for dollar/cents input
    stock: 0,
    status: 'draft' as 'draft' | 'scheduled' | 'live' | 'sold' | 'archived',
    images: [] as string[],
    tags: [] as string[]
  });

  // Use controlled or uncontrolled open state
  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;

  // Load product settings
  useEffect(() => {
    const loadProductSettings = async () => {
      try {
        const response = await fetch('/api/products/settings');
        if (response.ok) {
          const settings = await response.json();
          setProductSettings(settings);
        }
      } catch (error) {
        console.error('Error loading product settings:', error);
      }
    };

    if (modalOpen) {
      loadProductSettings();
    }
  }, [modalOpen]);

  // Update form data when product changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && product) {
      const priceInDollars = (product.price / 100).toFixed(2);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        priceDisplay: priceInDollars,
        stock: product.stock,
        status: product.status,
        images: product.images,
        tags: product.tags || []
      });
    } else if (mode === 'add') {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: 0,
        priceDisplay: '',
        stock: 0,
        status: 'draft',
        images: [],
        tags: []
      });
    }
  }, [mode, product]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priceDisplay: value
    }));

    // Convert dollar amount to cents
    const dollars = parseFloat(value) || 0;
    const cents = Math.round(dollars * 100);
    setFormData(prev => ({
      ...prev,
      price: cents
    }));
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
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
      <DialogContent className="sm:max-w-[500px]">
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
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (in dollars) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceDisplay}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0.00"
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
            
            {/* Tags Section */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Type a tag and press Enter"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tagInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Available tags suggestions */}
                {productSettings?.available_tags && productSettings.available_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {productSettings.available_tags
                      .filter(tag => !formData.tags.includes(tag))
                      .map(tag => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addTag(tag)}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                  </div>
                )}
                
                {/* Selected tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map(tag => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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