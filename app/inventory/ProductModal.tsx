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
import { ChevronDown, Search } from 'lucide-react'

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
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0, // stored in cents
    priceDisplay: '', // for dollar/cents input
    stock: 0,
    status: 'draft' as 'draft' | 'scheduled' | 'live' | 'sold' | 'archived',
    images: [] as string[],
    category: ''
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
        category: product.category || ''
      });
      setCategoryInput(product.category || '');
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
        category: ''
      });
      setCategoryInput('');
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

  const handleCategoryChange = (value: string) => {
    setCategoryInput(value);
    setFormData(prev => ({
      ...prev,
      category: value
    }));
    setShowCategoryDropdown(true);
  };

  const selectCategory = (category: string) => {
    setCategoryInput(category);
    setFormData(prev => ({
      ...prev,
      category: category
    }));
    setShowCategoryDropdown(false);
  };

  const filteredCategories = productSettings?.available_categories?.filter(cat =>
    cat.toLowerCase().includes((categoryInput || '').toLowerCase())
  ) || [];

  const handleCategoryInputFocus = () => {
    setShowCategoryDropdown(true);
  };

  const handleCategoryInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => setShowCategoryDropdown(false), 200);
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
            
            {/* Category Section */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <div className="relative">
                <Input
                  id="category"
                  value={categoryInput}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  onFocus={handleCategoryInputFocus}
                  onBlur={handleCategoryInputBlur}
                  placeholder="Select a category"
                  required
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                {showCategoryDropdown && (
                  <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map(category => (
                        <button
                          key={category}
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => selectCategory(category)}
                        >
                          {category}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No categories found</div>
                    )}
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