//
// Inventory.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// inventory management component
//

'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductModal from "./ProductModal";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Archive, Plus, Clock, CheckCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function Inventory({ initialData }: { initialData: Product[] }) {
  const [data, setData] = useState<Product[]>(initialData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Filter products based on search
  const filteredProducts = data.filter(product =>
    product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
    product.description.toLowerCase().includes(globalFilter.toLowerCase()) ||
    product.status.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setData(data.filter(p => p.id !== id));
  };

  const handleAdd = (newProduct: Product) => {
    setData([newProduct, ...data]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setData(data.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleStatusChange = async (productId: string, newStatus: 'draft' | 'scheduled' | 'live' | 'sold' | 'archived') => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedProduct = await response.json();
      setData(data.map(p => p.id === productId ? updatedProduct : p));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-purple-100 text-purple-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search products..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <ProductModal
          mode="add"
          onProductAdded={handleAdd}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          }
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Images</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
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
                  {product.tags && product.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No tags</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(product.status)}`}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(product.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(product.id, 'draft')}
                        disabled={product.status === 'draft'}
                      >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Set to Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(product.id, 'scheduled')}
                        disabled={product.status === 'scheduled'}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Set to Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(product.id, 'live')}
                        disabled={product.status === 'live'}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Set to Live
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(product.id, 'sold')}
                        disabled={product.status === 'sold'}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Sold
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(product.id, 'archived')}
                        disabled={product.status === 'archived'}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  {globalFilter ? 'No products found matching your search.' : 'No products yet. Click "Add Product" to get started.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <ProductModal
        mode="edit"
        product={editingProduct}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
}

export async function deleteProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete product');
}
