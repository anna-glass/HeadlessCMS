//
// FooterSection.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// footer section component for website builder
//

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { WebsiteData } from '@/lib/types/website'
import { generateSlug } from '@/lib/utils'

interface FooterItem {
  label: string
  slug: string
}

interface FooterProps {
  footer_items: FooterItem[]
  social_links: string[]
  include_email_list: boolean
  email_list_title: string
  email_list_cta: string
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function Footer({ 
  footer_items, 
  social_links,
  include_email_list,
  email_list_title,
  email_list_cta,
  onUpdate 
}: FooterProps) {
  const socialPlatforms = ['Instagram', 'Facebook', 'Pinterest', 'TikTok']

  const togglePlatform = (platform: string) => {
    const platformUrl = getSocialLinkValue(platform)
    if (platformUrl) {
      // Remove platform
      const newLinks = social_links.filter(link => !link.includes(platform.toLowerCase()))
      onUpdate('social_links', newLinks)
    } else {
      // Add platform
      const newLinks = [...social_links, '']
      onUpdate('social_links', newLinks)
    }
  }

  const updateSocialLink = (platform: string, value: string) => {
    const platformLower = platform.toLowerCase()
    const existingIndex = social_links.findIndex(link => link.includes(platformLower))
    
    if (existingIndex >= 0) {
      const newLinks = [...social_links]
      newLinks[existingIndex] = value
      onUpdate('social_links', newLinks)
    } else {
      onUpdate('social_links', [...social_links, value])
    }
  }

  const getSocialLinkValue = (platform: string) => {
    const platformLower = platform.toLowerCase()
    return social_links.find(link => link.includes(platformLower)) || ''
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Footer Items</Label>
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
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Social Links</Label>
          <div className="space-y-2">
            {socialPlatforms.map((platform) => {
              const isActive = getSocialLinkValue(platform)
              return (
                <div key={platform} className="flex gap-2">
                  <Button
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                    className="w-24"
                  >
                    {platform}
                  </Button>
                  {isActive && (
                    <Input
                      value={getSocialLinkValue(platform)}
                      onChange={(e) => updateSocialLink(platform, e.target.value)}
                      placeholder={`${platform} URL`}
                      className="flex-1"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="email_list_title">Email List Title</Label>
          <Input
            id="email_list_title"
            value={email_list_title}
            onChange={(e) => onUpdate('email_list_title', e.target.value)}
            placeholder="Stay updated"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email_list_cta">Email List CTA</Label>
          <Input
            id="email_list_cta"
            value={email_list_cta}
            onChange={(e) => onUpdate('email_list_cta', e.target.value)}
            placeholder="Subscribe"
          />
        </div>
      </CardContent>
    </Card>
  )
} 