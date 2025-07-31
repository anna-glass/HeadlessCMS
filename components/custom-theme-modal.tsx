'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Palette, Type, Plus } from 'lucide-react'
import { getFontClass } from '@/lib/fonts'

interface CustomTheme {
  name: string
  colorPrimary: string
  colorSecondary: string
  colorTertiary: string
  colorLight: string
  colorDark: string
  fontHeading: string
  fontBody: string
  radius: string
}

interface CustomThemeModalProps {
  onThemeCreate: (theme: CustomTheme) => void
}

const fontOptions = [
  { value: 'Manrope', label: 'Manrope' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Almarai', label: 'Almarai' },
  { value: 'Young Serif', label: 'Young Serif' },
  { value: 'Bitter', label: 'Bitter' },
  { value: 'Sansita', label: 'Sansita' },
  { value: 'Nunito Sans', label: 'Nunito Sans' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
]

const radiusOptions = [
  { value: '0px', label: 'Sharp (0px)' },
  { value: '2px', label: 'Slight (2px)' },
  { value: '4px', label: 'Small (4px)' },
  { value: '6px', label: 'Medium (6px)' },
  { value: '8px', label: 'Large (8px)' },
  { value: '12px', label: 'Extra Large (12px)' },
  { value: '16px', label: 'Rounded (16px)' },
]

export function CustomThemeModal({ onThemeCreate }: CustomThemeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<CustomTheme>({
    name: '',
    colorPrimary: '#F5F5F5',
    colorSecondary: '#D9D9D9',
    colorTertiary: '#797979',
    colorLight: '#FFFFFF',
    colorDark: '#000000',
    fontHeading: 'Manrope',
    fontBody: 'Poppins',
    radius: '0px'
  })

  const handleInputChange = (field: keyof CustomTheme, value: string) => {
    setTheme(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreate = () => {
    if (theme.name.trim()) {
      onThemeCreate(theme)
      setIsOpen(false)
      // Reset form
      setTheme({
        name: '',
        colorPrimary: '#F5F5F5',
        colorSecondary: '#D9D9D9',
        colorTertiary: '#797979',
        colorLight: '#FFFFFF',
        colorDark: '#000000',
        fontHeading: 'Manrope',
        fontBody: 'Poppins',
        radius: '0px'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Your Own
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Create Custom Theme
          </DialogTitle>
          <DialogDescription>
            Design your own theme with custom colors, fonts, and styling.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={theme.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter theme name"
            />
          </div>

          <Separator />

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color-primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-primary"
                    type="color"
                    value={theme.colorPrimary}
                    onChange={(e) => handleInputChange('colorPrimary', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={theme.colorPrimary}
                    onChange={(e) => handleInputChange('colorPrimary', e.target.value)}
                    placeholder="#F5F5F5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-secondary"
                    type="color"
                    value={theme.colorSecondary}
                    onChange={(e) => handleInputChange('colorSecondary', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={theme.colorSecondary}
                    onChange={(e) => handleInputChange('colorSecondary', e.target.value)}
                    placeholder="#D9D9D9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-tertiary">Tertiary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-tertiary"
                    type="color"
                    value={theme.colorTertiary}
                    onChange={(e) => handleInputChange('colorTertiary', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={theme.colorTertiary}
                    onChange={(e) => handleInputChange('colorTertiary', e.target.value)}
                    placeholder="#797979"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-light">Light Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-light"
                    type="color"
                    value={theme.colorLight}
                    onChange={(e) => handleInputChange('colorLight', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={theme.colorLight}
                    onChange={(e) => handleInputChange('colorLight', e.target.value)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-dark">Dark Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-dark"
                    type="color"
                    value={theme.colorDark}
                    onChange={(e) => handleInputChange('colorDark', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={theme.colorDark}
                    onChange={(e) => handleInputChange('colorDark', e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typography
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font-heading">Heading Font</Label>
                <Select value={theme.fontHeading} onValueChange={(value) => handleInputChange('fontHeading', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select heading font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={getFontClass(font.value)}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className={`text-sm font-bold ${getFontClass(theme.fontHeading)}`}>
                  {theme.fontHeading}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-body">Body Font</Label>
                <Select value={theme.fontBody} onValueChange={(value) => handleInputChange('fontBody', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={getFontClass(font.value)}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className={`text-sm font-normal ${getFontClass(theme.fontBody)}`}>
                  {theme.fontBody}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Border Radius */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Border Radius</h3>
            <div className="space-y-2">
              <Label htmlFor="radius">Button & Element Radius</Label>
              <Select value={theme.radius} onValueChange={(value) => handleInputChange('radius', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select border radius" />
                </SelectTrigger>
                <SelectContent>
                  {radiusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="p-4 border rounded-lg space-y-3">
              <div className={`text-xl font-bold ${getFontClass(theme.fontHeading)}`}>
                {theme.name || 'Theme Name'}
              </div>
              <div className="flex gap-1">
                <div 
                  className="w-6 h-6 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorPrimary }}
                />
                <div 
                  className="w-6 h-6 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorSecondary }}
                />
                <div 
                  className="w-6 h-6 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorTertiary }}
                />
                <div 
                  className="w-6 h-6 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorLight }}
                />
                <div 
                  className="w-6 h-6 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorDark }}
                />
              </div>
              <div className={`text-sm ${getFontClass(theme.fontBody)}`}>
                This is how your body text will look.
              </div>
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors ${getFontClass(theme.fontBody)}`}
                style={{
                  backgroundColor: theme.colorPrimary,
                  color: theme.colorDark,
                  borderRadius: theme.radius
                }}
              >
                Example Button
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!theme.name.trim()}>
              Create Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 