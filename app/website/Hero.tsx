//
// HeroSection.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// hero section component for website builder
//

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { uploadFileToS3, validateImageFile } from '@/lib/s3-upload'

interface HeroProps {
  hero_image_1: string
  hero_image_2: string
  hero_title: string
  hero_subtitle: string
  hero_cta: string
  include_intro: boolean
  intro_text: string
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function Hero({ 
  hero_image_1, 
  hero_image_2, 
  hero_title, 
  hero_subtitle, 
  hero_cta,
  include_intro,
  intro_text,
  onUpdate 
}: HeroProps) {
  const [isUploading1, setIsUploading1] = useState(false)
  const [isUploading2, setIsUploading2] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageField: 'hero_image_1' | 'hero_image_2') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file using utility function
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    const setIsUploading = imageField === 'hero_image_1' ? setIsUploading1 : setIsUploading2
    setIsUploading(true)
    
    try {
      const uploadResult = await uploadFileToS3(file)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload image')
      }

      onUpdate(imageField, uploadResult.publicFileUrl!)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hero Image 1</Label>
            <div className="space-y-4">
              {hero_image_1 ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={hero_image_1} 
                      alt="Hero Image 1" 
                      className="h-20 w-20 object-cover border rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => onUpdate('hero_image_1', '')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload hero image 1</p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 2MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-image-1-upload')?.click()}
                    disabled={isUploading1}
                  >
                    {isUploading1 ? 'Uploading...' : 'Choose File'}
                  </Button>
                </div>
              )}
              <input
                id="hero-image-1-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero_image_1')}
                className="hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Hero Image 2 (Optional)</Label>
            <div className="space-y-4">
              {hero_image_2 ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={hero_image_2} 
                      alt="Hero Image 2" 
                      className="h-20 w-20 object-cover border rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => onUpdate('hero_image_2', '')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload hero image 2 (optional)</p>
                  <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 2MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-image-2-upload')?.click()}
                    disabled={isUploading2}
                  >
                    {isUploading2 ? 'Uploading...' : 'Choose File'}
                  </Button>
                </div>
              )}
              <input
                id="hero-image-2-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero_image_2')}
                className="hidden"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero_title">Hero Title</Label>
          <Input
            id="hero_title"
            value={hero_title}
            onChange={(e) => onUpdate('hero_title', e.target.value)}
            placeholder="Enter hero title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
          <Input
            id="hero_subtitle"
            value={hero_subtitle}
            onChange={(e) => onUpdate('hero_subtitle', e.target.value)}
            placeholder="Enter hero subtitle"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero_cta">Hero CTA</Label>
          <Input
            id="hero_cta"
            value={hero_cta}
            onChange={(e) => onUpdate('hero_cta', e.target.value)}
            placeholder="Shop Now"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="intro_text">Intro Text</Label>
          <Textarea
            id="intro_text"
            value={intro_text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate('intro_text', e.target.value)}
            placeholder="Enter intro text"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  )
} 