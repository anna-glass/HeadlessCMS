//
// NavigationSection.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// navigation section component for website builder
//

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'
import { uploadFileToS3, validateImageFile } from '@/lib/s3-upload'
import { generateSlug } from '@/lib/utils'

interface NavigationItem {
  label: string
  slug: string
}

interface NavigationProps {
  announcement: string
  logo: string
  navigation_items: NavigationItem[]
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function Navigation({ 
  announcement, 
  logo, 
  navigation_items, 
  onUpdate 
}: NavigationProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file using utility function
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsUploading(true)
    try {
      const uploadResult = await uploadFileToS3(file)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload logo')
      }

      onUpdate('logo', uploadResult.publicFileUrl!)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload logo')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
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
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your logo</p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 2MB</p>
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
              onChange={handleLogoUpload}
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