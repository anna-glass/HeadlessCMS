// Inventory.tsx
'use client'

import { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  status: "draft" | "live" | "archived";
  created_at: string;
  updated_at: string;
}

export default function Inventory({ initialData }: { initialData: Product[] }) {
  const [data, setData] = useState<Product[]>(initialData);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: info => <Input defaultValue={info.getValue() as string} onBlur={e => handleEdit(info.row.original.id, "name", e.target.value)} />,
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: info => <Input defaultValue={info.getValue() as string} onBlur={e => handleEdit(info.row.original.id, "description", e.target.value)} />,
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: info => <Input type="number" defaultValue={info.getValue()?.toString()} onBlur={e => handleEdit(info.row.original.id, "price", parseFloat(e.target.value))} />,
      },
      {
        header: "Stock",
        accessorKey: "stock",
        cell: info => <Input type="number" defaultValue={info.getValue()?.toString()} onBlur={e => handleEdit(info.row.original.id, "stock", parseInt(e.target.value))} />,
      },
      {
        header: "Status",
        accessorKey: "status",
      },
      {
        header: "Actions",
        cell: info => (
          <Button variant="destructive" onClick={() => handleDelete(info.row.original.id)}>
            Delete
          </Button>
        ),
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleEdit = async (id: string, key: keyof Product, value: any) => {
    const updated = data.map(product =>
      product.id === id ? { ...product, [key]: value, updated_at: new Date().toISOString() } : product
    );
    setData(updated);
    await updateProduct(id, { [key]: value });
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setData(data.filter(p => p.id !== id));
  };

  const handleAdd = async () => {
    const newProduct = await createProduct();
    setData([newProduct, ...data]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />
        <Button onClick={handleAdd}>Add Product</Button>
      </div>
      <table className="w-full text-left border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border p-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function createProduct() {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Untitled Product',
        description: '',
        price: 0,
        stock: 0,
        images: [],
        status: 'draft',
      }),
    });
  
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
}

  
export async function deleteProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete product');
}

export async function updateProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
}
  
  
