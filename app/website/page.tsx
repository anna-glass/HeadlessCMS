'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WebsiteData } from '@/lib/types/website'
import { ThemeSelector } from '@/components/theme-selector'
import { Globe } from 'lucide-react'
import {
  NavigationSection,
  HeroSection,
  IntroSection,
  EmailListSection,
  BlogPostsSection,
  FooterSection,
  SocialLinksSection
} from './components'

// Default website data
const defaultWebsiteData: WebsiteData = {
  // Theme
  theme: "slate",
  
  // Navigation
  announcement: "Drop 1 coming August 15th",
  logo: "/airlet.svg",
  navigation_items: [
    { label: "Home", slug: "/" },
    { label: "Shop", slug: "/shop" },
    { label: "About", slug: "/about" },
    { label: "Contact", slug: "/contact" }
  ],
  
  // Hero
  hero_image_1: "/hero-image-1.png",
  hero_image_2: "/hero-image-2.png",
  hero_title: "Bag charms made in drops",
  hero_subtitle: "Inspired by the quiet beauty of Northern California",
  hero_cta: "Shop Now",
  
  // Intro
  include_intro: true,
  intro_text: "Airlets are custom bag charms rooted in a moment - An Airbnb in Copenhagen. Fog settling in on the Central Coast. A glass of red at the neighborhood wine bar. Some are polished. Some raw. Each one made with care, and only once.",
  
  // Blog Posts
  include_blog: true,
  blog_posts: [
    {
      title: "Meet our signature scent",
      image: "/post-1.jpg",
      body: "Soft start is a clean floral with worn-in softness, inspired by damp mornings, lip gloss on mugs, and friends laughing in the kitchen.",
      slug: "meet-our-signature-scent"
    },
    {
      title: "Talismans, Not Accessories",
      image: "/post-2.jpg",
      body: "Airlets aren't just charms, they're anchors. For mood. For scent. For self. Small enough to forget. Meaningful enough to carry.",
      slug: "talismans-not-accessories"
    },
    {
      title: "Why I Started Airlet",
      image: "/post-3.jpg",
      body: "I've always loved the kinds of things you hold, carry, or keep without thinking. Things that are worn, gifted, forgotten, found again.",
      slug: "why-i-started-airlet"
    }
  ],
  
  // Email List
  include_email_list: true,
  email_list_title: "Stay in the loop",
  email_list_cta: "Subscribe",
  
  // Footer
  social_links: ["Instagram", "Facebook", "Pinterest"],
  footer_items: [
    { label: "Our Story", slug: "/story" },
    { label: "Our Mission", slug: "/mission" },
    { label: "Our Team", slug: "/team" },
    { label: "Our Blog", slug: "/blog" },
    { label: "Contact Us", slug: "/contact" },
    { label: "Privacy Policy", slug: "/privacy" },
    { label: "Terms of Service", slug: "/terms" }
  ]
}

export default function WebsitePage() {
  const [websiteData, setWebsiteData] = useState<WebsiteData>(defaultWebsiteData)

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
    // TODO: Implement save functionality to backend
    console.log('Saving website data:', websiteData)
  }

  const handleCustomThemeCreate = (customTheme: any) => {
    console.log('Custom theme created:', customTheme)
    // TODO: Add custom theme to the list or save to backend
    alert(`Custom theme "${customTheme.name}" created successfully!`)
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
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Theme Selector */}
      <Card>
        <CardContent>
          <ThemeSelector
            selectedTheme={websiteData.theme}
            onThemeSelect={(themeId) => handleInputChange('theme', themeId)}
            onCustomThemeCreate={handleCustomThemeCreate}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Navigation */}
        <NavigationSection
          announcement={websiteData.announcement}
          logo={websiteData.logo}
          navigation_items={websiteData.navigation_items}
          onUpdate={handleInputChange}
        />

        {/* Hero Section */}
        <HeroSection
          hero_image_1={websiteData.hero_image_1}
          hero_image_2={websiteData.hero_image_2}
          hero_title={websiteData.hero_title}
          hero_subtitle={websiteData.hero_subtitle}
          hero_cta={websiteData.hero_cta}
          onUpdate={handleInputChange}
        />

        {/* Intro Section */}
        <IntroSection
          include_intro={websiteData.include_intro}
          intro_text={websiteData.intro_text}
          onUpdate={handleInputChange}
        />

        {/* Email List */}
        <EmailListSection
          include_email_list={websiteData.include_email_list}
          email_list_title={websiteData.email_list_title}
          email_list_cta={websiteData.email_list_cta}
          onUpdate={handleInputChange}
        />
      </div>

      <Separator />

      {/* Blog Posts */}
      <BlogPostsSection
        include_blog={websiteData.include_blog}
        blog_posts={websiteData.blog_posts}
        onUpdate={handleInputChange}
      />

      <Separator />

      {/* Footer */}
      <div className="grid gap-6 md:grid-cols-2">
        <FooterSection
          footer_items={websiteData.footer_items}
          onUpdate={handleInputChange}
        />

        <SocialLinksSection
          social_links={websiteData.social_links}
          onUpdate={handleInputChange}
        />
      </div>
    </div>
  )
} 