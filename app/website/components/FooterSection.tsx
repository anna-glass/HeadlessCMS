'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'lucide-react'
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

interface FooterItem {
  label: string
  slug: string
}

interface FooterSectionProps {
  footer_items: FooterItem[]
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function FooterSection({ 
  footer_items, 
  onUpdate 
}: FooterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Footer Items
        </CardTitle>
        <CardDescription>Manage footer navigation links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {footer_items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item.label}
                onChange={(e) => {
                  const newItems = [...footer_items]
                  const newLabel = e.target.value
                  const newSlug = generateSlug(newLabel)
                  newItems[index] = { label: newLabel, slug: newSlug }
                  onUpdate('footer_items', newItems)
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
                  const newItems = footer_items.filter((_, i) => i !== index)
                  onUpdate('footer_items', newItems)
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newItems = [...footer_items, { label: '', slug: '' }]
              onUpdate('footer_items', newItems)
            }}
          >
            Add Footer Item
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 