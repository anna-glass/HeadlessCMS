//
// website/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// website builder page
//

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WebsiteData } from '@/lib/types/website'
import { ThemeSelector } from '@/app/website/theme-selector'
import { Globe } from 'lucide-react'
import { Navigation } from './Navigation'
import { Hero } from './Hero'
import { BlogPosts } from './BlogPosts'
import { Footer } from './Footer'
import { Switch } from '@/components/ui/switch'
import { CustomThemeModal } from '@/app/website/custom-theme-modal'
import { PageLoader } from '@/components/ui/loader'

// Default website data
const defaultWebsiteData: WebsiteData = {
  // Theme
  theme: "slate",
  
  // Navigation
  announcement: "",
  logo: "",
  navigation_items: [],
  
  // Hero
  hero_image_1: "",
  hero_image_2: "",
  hero_title: "",
  hero_subtitle: "",
  hero_cta: "",
  
  // Intro
  include_intro: true,
  intro_text: "",
  
  // Blog Posts
  include_blog: true,
  blog_posts: [],
  
  // Email List
  include_email_list: true,
  email_list_title: "",
  email_list_cta: "",
  
  // Footer
  social_links: [],
  footer_items: [
    { label: "Contact", slug: "/contact" },
    { label: "Privacy Policy", slug: "/privacy" },
    { label: "Terms of Service", slug: "/terms" }
  ]
}

export default function WebsitePage() {
  const [websiteData, setWebsiteData] = useState<WebsiteData>(defaultWebsiteData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load website data on mount
  useEffect(() => {
    loadWebsiteData()
  }, [])

  const loadWebsiteData = async () => {
    try {
      const response = await fetch('/api/website')
      if (response.ok) {
        const data = await response.json()
        setWebsiteData(data)
      } else if (response.status === 404) {
        // No website found, use default data
        console.log('No website found, using default data')
      } else {
        console.error('Failed to load website data')
      }
    } catch (error) {
      console.error('Error loading website data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof WebsiteData, value: any) => {
    setWebsiteData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: keyof WebsiteData, index: number, value: any) => {
    setWebsiteData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) ? (prev[field] as any[]).map((item: any, i: number) => 
        i === index ? { ...item, ...value } : item
      ) : prev[field]
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(websiteData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Website data saved successfully:', result)
        // You could show a success toast here
      } else {
        const error = await response.json()
        console.error('Failed to save website data:', error)
        // You could show an error toast here
      }
    } catch (error) {
      console.error('Error saving website data:', error)
      // You could show an error toast here
    } finally {
      setIsSaving(false)
    }
  }

  const handleCustomThemeCreate = (customTheme: any) => {
    console.log('Custom theme created:', customTheme)
    // TODO: Add custom theme to the list or save to backend
    alert(`Custom theme "${customTheme.name}" created successfully!`)
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground">
            Customize your ecommerce website settings and content
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Theme Selector */}
      <div>
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold pt-6 mb-4">Theme</h2>
          <CustomThemeModal onThemeCreate={handleCustomThemeCreate} />
        </div>
        <Card>
          <CardContent>
            <ThemeSelector
              selectedTheme={websiteData.theme}
              onThemeSelect={(themeId) => handleInputChange('theme', themeId)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        {/* Navigation */}
        <div>
          <h2 className="text-2xl font-semibold pt-6 mb-4">Navigation</h2>
          <Navigation
            announcement={websiteData.announcement}
            logo={websiteData.logo}
            navigation_items={websiteData.navigation_items}
            onUpdate={handleInputChange}
          />
        </div>

        {/* Hero Section */}
        <div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold pt-6 mb-4">Hero Section</h2>
            <Switch
              checked={websiteData.include_intro}
              onCheckedChange={(checked) => handleInputChange('include_intro', checked)}
            />
          </div>
          <Hero
            hero_image_1={websiteData.hero_image_1}
            hero_image_2={websiteData.hero_image_2}
            hero_title={websiteData.hero_title}
            hero_subtitle={websiteData.hero_subtitle}
            hero_cta={websiteData.hero_cta}
            include_intro={websiteData.include_intro}
            intro_text={websiteData.intro_text}
            onUpdate={handleInputChange}
          />
        </div>

        {/* Blog Posts */}
        <div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold pt-6 mb-4">Blog Posts</h2>
            <Switch
              checked={websiteData.include_blog}
              onCheckedChange={(checked) => handleInputChange('include_blog', checked)}
            />
          </div>
          <BlogPosts
            include_blog={websiteData.include_blog}
            blog_posts={websiteData.blog_posts}
            onUpdate={handleInputChange}
          />
        </div>

        {/* Footer */}
        <div>
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-semibold pt-6 mb-4">Footer</h2>
            <Switch
              checked={websiteData.include_email_list}
              onCheckedChange={(checked) => handleInputChange('include_email_list', checked)}
            />
          </div>
          <Footer
            footer_items={websiteData.footer_items}
            social_links={websiteData.social_links}
            include_email_list={websiteData.include_email_list}
            email_list_title={websiteData.email_list_title}
            email_list_cta={websiteData.email_list_cta}
            onUpdate={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
} 