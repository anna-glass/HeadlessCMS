'use client'

import { Card, CardContent } from '@/components/ui/card'
import { themes, Theme } from '@/lib/types/theme'
import { getFontClass } from '@/lib/fonts'
import { CustomThemeModal } from './custom-theme-modal'
import { Check } from 'lucide-react'

interface ThemeSelectorProps {
  selectedTheme: string
  onThemeSelect: (themeId: string) => void
  onCustomThemeCreate?: (theme: any) => void
}

export function ThemeSelector({ selectedTheme, onThemeSelect, onCustomThemeCreate }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Choose Theme</h3>
        <CustomThemeModal onThemeCreate={onCustomThemeCreate || (() => {})} />
      </div>
      
      <div className="flex flex-row w-full gap-4">
        {themes.map((theme) => (
        <Card
          key={theme.id}
          className={`flex-1 cursor-pointer transition-all hover:shadow-md ${
            selectedTheme === theme.id ? 'ring-2 ring-primary bg-primary/5 shadow-lg' : ''
          }`}
          onClick={() => onThemeSelect(theme.id)}
        >
          <CardContent className="">
            <div className="space-y-4">
              {/* Theme Name */}
              <div>
                <h3 className="text-xl font-semibold">{theme.name}</h3>
              </div>

              {/* Color Palette */}
              <div className="flex gap-1">
                <div 
                  className="w-12 h-12 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorPrimary }}
                  title="Primary"
                />
                <div 
                  className="w-12 h-12 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorSecondary }}
                  title="Secondary"
                />
                <div 
                  className="w-12 h-12 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorTertiary }}
                  title="Tertiary"
                />
                <div 
                  className="w-12 h-12 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorLight }}
                  title="Light"
                />
                <div 
                  className="w-12 h-12 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.colorDark }}
                  title="Dark"
                />
              </div>

              {/* Fonts */}
              <div className="space-y-3">
                <div>
                  <div className={`text-lg font-bold ${getFontClass(theme.fontHeading)}`}>
                    {theme.fontHeading}
                  </div>
                </div>
                <div>
                  <div className={`text-lg font-normal ${getFontClass(theme.fontBody)}`}>
                    {theme.fontBody}
                  </div>
                </div>
              </div>

              {/* Example Button */}
              <button
                className={`px-6 py-4 text-base font-medium transition-colors ${getFontClass(theme.fontBody)}`}
                style={{
                  backgroundColor: theme.colorPrimary,
                  color: theme.colorDark,
                  borderRadius: theme.radius
                }}
              >
                Example Button
              </button>


            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  )
} 