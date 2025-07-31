'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Users } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'

interface EmailListSectionProps {
  include_email_list: boolean
  email_list_title: string
  email_list_cta: string
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function EmailListSection({ 
  include_email_list, 
  email_list_title, 
  email_list_cta, 
  onUpdate 
}: EmailListSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Email List
            </CardTitle>
            <CardDescription>Email signup section</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include_email_list"
              checked={include_email_list}
              onCheckedChange={(checked: boolean) => onUpdate('include_email_list', checked)}
            />
            <Label htmlFor="include_email_list">Include Email List</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {include_email_list && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email_list_title">Email List Title</Label>
              <Input
                id="email_list_title"
                value={email_list_title}
                onChange={(e) => onUpdate('email_list_title', e.target.value)}
                placeholder="Stay in the loop"
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
          </>
        )}
      </CardContent>
    </Card>
  )
} 