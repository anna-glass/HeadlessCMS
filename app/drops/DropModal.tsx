//
// DropModal.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// drop modal component for adding/editing drops
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
import { Drop, Product } from '@/lib/types/drop'
import { Checkbox } from '@/components/ui/checkbox'
import { Package, Calendar } from 'lucide-react'

interface DropModalProps {
  mode: 'add' | 'edit';
  drop?: Drop | null;
  availableProducts: Product[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDropAdded?: (drop: Drop) => void;
  onDropUpdated?: (drop: Drop) => void;
  trigger?: React.ReactNode;
}

export default function DropModal({ 
  mode,
  drop,
  availableProducts,
  open,
  onOpenChange,
  onDropAdded,
  onDropUpdated,
  trigger
}: DropModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'completed' | 'cancelled',
    product_ids: [] as string[]
  });

  // Use controlled or uncontrolled open state
  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;

  // Update form data when drop changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && drop) {
      setFormData({
        title: drop.title,
        description: drop.description || '',
        scheduled_at: new Date(drop.scheduled_at).toISOString().slice(0, 16), // Format for datetime-local input
        status: drop.status,
        product_ids: drop.products?.map(p => p.id) || []
      });
    } else if (mode === 'add') {
      // Reset form for add mode
      setFormData({
        title: '',
        description: '',
        scheduled_at: '',
        status: 'scheduled',
        product_ids: []
      });
    }
  }, [mode, drop]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductToggle = (productId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      product_ids: checked 
        ? [...prev.product_ids, productId]
        : prev.product_ids.filter(id => id !== productId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === 'add' ? '/api/drops' : `/api/drops/${drop?.id}`;
      const method = mode === 'add' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${mode} drop`);
      }

      const result = await response.json();
      
      if (mode === 'add' && onDropAdded) {
        onDropAdded(result);
      } else if (mode === 'edit' && onDropUpdated) {
        onDropUpdated(result);
      }

      setModalOpen(false);
    } catch (error) {
      console.error(`Error ${mode}ing drop:`, error);
      alert(error instanceof Error ? error.message : `Failed to ${mode} drop`);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Drop' : 'New Drop';
  const description = isEditMode ? 'Update the drop details below.' : 'Fill out the details below to create a new drop.';
  const submitText = isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Drop' : 'Create Drop');

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Drop Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter drop title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
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
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                required
              />
            </div>

            {isEditMode && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value as 'scheduled' | 'live' | 'completed' | 'cancelled')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label>Select Products</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {availableProducts.length > 0 ? (
                  availableProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={product.id}
                        checked={formData.product_ids.includes(product.id)}
                        onCheckedChange={(checked) => 
                          handleProductToggle(product.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={product.id} 
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ${(product.price / 100).toFixed(2)}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No draft products available</p>
                    <p className="text-xs">Create draft products in Inventory to add them to drops</p>
                  </div>
                )}
              </div>
              {formData.product_ids.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formData.product_ids.length} product{formData.product_ids.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
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
            <Button type="submit" disabled={isLoading || !formData.title || !formData.scheduled_at}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 