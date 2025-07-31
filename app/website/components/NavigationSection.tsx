'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, Upload, X } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'

// Utility function to generate slugs
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

interface NavigationItem {
  label: string
  slug: string
}

interface NavigationSectionProps {
  announcement: string
  logo: string
  navigation_items: NavigationItem[]
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function NavigationSection({ 
  announcement, 
  logo, 
  navigation_items, 
  onUpdate 
}: NavigationSectionProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUpdate('logo', data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Navigation
        </CardTitle>
        <CardDescription>Customize your site navigation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="announcement">Announcement Text</Label>
          <Input
            id="announcement"
            value={announcement}
            onChange={(e) => onUpdate('announcement', e.target.value)}
            placeholder="Enter announcement"
          />
        </div>
        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="space-y-4">
            {logo ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-16 w-16 object-contain border rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => onUpdate('logo', '')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Current logo</p>
                  <p className="text-xs text-muted-foreground truncate">{logo}</p>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your logo</p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG, SVG up to 5MB</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Navigation Items</Label>
          <div className="space-y-2">
            {navigation_items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...navigation_items]
                    const newLabel = e.target.value
                    const newSlug = generateSlug(newLabel)
                    newItems[index] = { label: newLabel, slug: newSlug }
                    onUpdate('navigation_items', newItems)
                  }}
                  placeholder="Label"
                />
                <Input
                  value={item.slug}
                  readOnly
                  className="bg-gray-50 text-gray-500"
                  placeholder="Auto-generated slug"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = navigation_items.filter((_, i) => i !== index)
                    onUpdate('navigation_items', newItems)
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const newItems = [...navigation_items, { label: '', slug: '' }]
                onUpdate('navigation_items', newItems)
              }}
            >
              Add Navigation Item
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 