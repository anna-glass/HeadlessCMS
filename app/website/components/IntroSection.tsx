'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'

interface IntroSectionProps {
  include_intro: boolean
  intro_text: string
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function IntroSection({ 
  include_intro, 
  intro_text, 
  onUpdate 
}: IntroSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Intro Section
            </CardTitle>
            <CardDescription>Include an intro section on your site</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include_intro"
              checked={include_intro}
              onCheckedChange={(checked: boolean) => onUpdate('include_intro', checked)}
            />
            <Label htmlFor="include_intro">Include Intro Section</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {include_intro && (
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
        )}
      </CardContent>
    </Card>
  )
} 