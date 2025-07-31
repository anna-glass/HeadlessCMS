'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Organization } from "@/lib/types/organization"
import { Edit, Upload } from "lucide-react"
import { uploadFileToS3, validateImageFile } from "@/lib/s3-upload"

interface OrganizationEditModalProps {
  organization: Organization | null
  onOrganizationUpdated?: (organization: Organization) => void
  trigger?: React.ReactNode
}

export function OrganizationEditModal({ 
  organization, 
  onOrganizationUpdated,
  trigger 
}: OrganizationEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    domain: organization?.domain || '',
    logo_url: organization?.logo_url || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Cleanup preview URL when component unmounts or when selectedFile changes
  useEffect(() => {
    return () => {
      if (formData.logo_url && formData.logo_url.startsWith('blob:')) {
        URL.revokeObjectURL(formData.logo_url)
      }
    }
  }, [formData.logo_url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let logoUrl = formData.logo_url

      // If there's a new file selected, upload it to S3 first
      if (selectedFile) {
        const uploadResult = await uploadFileToS3(selectedFile)
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload logo')
        }

        logoUrl = uploadResult.publicFileUrl!
      }

      // Update the organization with the new logo URL
      const response = await fetch(`/api/organizations/${organization?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          logo_url: logoUrl
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update organization')
      }

      const updatedOrganization = await response.json()
      
      if (onOrganizationUpdated) {
        onOrganizationUpdated(updatedOrganization)
      }

      setIsOpen(false)
      setSelectedFile(null) // Reset selected file after successful update
    } catch (error) {
      console.error('Error updating organization:', error)
      alert(error instanceof Error ? error.message : 'Failed to update organization')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file using utility function
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    // Store the file for later upload
    setSelectedFile(file)
    
    // Create a preview URL for immediate display
    const previewUrl = URL.createObjectURL(file)
    handleInputChange('logo_url', previewUrl)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset form when modal is closed
      setFormData({
        name: organization?.name || '',
        domain: organization?.domain || '',
        logo_url: organization?.logo_url || ''
      })
      setSelectedFile(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Organization</DialogTitle>
          <DialogDescription>
            Update your organization details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="logo">Organization Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border">
                  {formData.logo_url ? (
                    <Image 
                      src={formData.logo_url} 
                      alt="Organization logo" 
                      width={64} 
                      height={64} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a new logo (PNG, JPG up to 2MB)
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                placeholder="yourdomain.com"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Your organization's domain
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading ? 'Updating...' : 'Update Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 