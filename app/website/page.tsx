'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { WebsiteData } from '@/lib/types/website'
import { ThemeSelector } from '@/components/theme-selector'
import { Globe, Image as ImageIcon, Type, Palette, FileText, ShoppingBag, Users, Link } from 'lucide-react'

// Default website data
const defaultWebsiteData: WebsiteData = {
  quote: "Airlets are custom bag charms rooted in a moment - An Airbnb in Copenhagen. Fog settling in on the Central Coast. A glass of red at the neighborhood wine bar. Some are polished. Some raw. Each one made with care, and only once.",
  font: "font-inter",
  theme: "slate",
  hero_title: "Bag charms made in drops",
  hero_subtitle: "Inspired by the quiet beauty of Northern California",
  logo: "/airlet.svg",
  announcement: "Drop 1 coming August 15th",
  announcement_bg: '#CAD5C9',
  hero_image_1: "/hero-image-1.png",
  hero_image_2: "/hero-image-2.png",
  post: [
    {
      title: "Meet our signature scent",
      description: "Soft start is a clean floral with worn-in softness, inspired by damp mornings, lip gloss on mugs, and friends laughing in the kitchen.",
      image: "/post-1.jpg",
      cta: "Read More",
      link: "/post-1"
    },
    {
      title: "Talismans, Not Accessories",
      description: "Airlets aren't just charms, they're anchors. For mood. For scent. For self. Small enough to forget. Meaningful enough to carry.",
      image: "/post-2.jpg",
      cta: "Read More",
      link: "/post-1"
    },
    {
      title: "Why I Started Airlet",
      description: "I've always loved the kinds of things you hold, carry, or keep without thinking. Things that are worn, gifted, forgotten, found again.",
      image: "/post-3.jpg",
      cta: "Join Now",
      link: "/post-1"
    }
  ],
  product_categories: [
    { image: "/category-1.jpg", title: "All" },
    { image: "/category-2.jpg", title: "Drops" },
    { image: "/category-3.jpg", title: "Merch" },
    { image: "/category-4.jpg", title: "Scented airlets" }
  ],
  new_products: [
    { image: "/product1.png", title: "airlet 001", price: "$28" },
    { image: "/product2.png", title: "airlet 002", price: "$28" },
    { image: "/product3.png", title: "airlet 003", price: "$28" },
    { image: "/product4.png", title: "airlet 004", price: "$28" },
    { image: "/product5.png", title: "airlet 005", price: "$28" },
    { image: "/product6.png", title: "airlet 006", price: "$28" }
  ],
  about: "Bag charms made in drops, inspired by the quiet beauty of Northern California.",
  footer_links: ["Our Story", "Our Mission", "Our Team", "Our Blog", "Contact Us", "Privacy Policy", "Terms of Service"],
  social_links: ["Instagram", "Facebook", "Pinterest"]
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
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Hero Section
            </CardTitle>
            <CardDescription>Customize your main hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={websiteData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={websiteData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_image_1">Hero Image 1</Label>
              <Input
                id="hero_image_1"
                value={websiteData.hero_image_1}
                onChange={(e) => handleInputChange('hero_image_1', e.target.value)}
                placeholder="/path/to/image.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_image_2">Hero Image 2</Label>
              <Input
                id="hero_image_2"
                value={websiteData.hero_image_2}
                onChange={(e) => handleInputChange('hero_image_2', e.target.value)}
                placeholder="/path/to/image.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Branding
            </CardTitle>
            <CardDescription>Update your brand elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={websiteData.logo}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                placeholder="/logo.svg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="font">Font Family</Label>
              <Select value={websiteData.font} onValueChange={(value) => handleInputChange('font', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="font-inter">Inter</SelectItem>
                  <SelectItem value="font-roboto">Roboto</SelectItem>
                  <SelectItem value="font-opensans">Open Sans</SelectItem>
                  <SelectItem value="font-poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement">Announcement Text</Label>
              <Input
                id="announcement"
                value={websiteData.announcement}
                onChange={(e) => handleInputChange('announcement', e.target.value)}
                placeholder="Enter announcement"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcement_bg">Announcement Background Color</Label>
              <Input
                id="announcement_bg"
                value={websiteData.announcement_bg}
                onChange={(e) => handleInputChange('announcement_bg', e.target.value)}
                placeholder="#CAD5C9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Quote Section
            </CardTitle>
            <CardDescription>Your main brand quote</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="quote">Brand Quote</Label>
              <Textarea
                id="quote"
                value={websiteData.quote}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('quote', e.target.value)}
                placeholder="Enter your brand quote"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              About Section
            </CardTitle>
            <CardDescription>Brief description about your brand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="about">About Text</Label>
              <Textarea
                id="about"
                value={websiteData.about}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('about', e.target.value)}
                placeholder="Enter about text"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Blog Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Blog Posts
          </CardTitle>
          <CardDescription>Manage your blog posts content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {websiteData.post.map((post, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">Post {index + 1}</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={post.title}
                      onChange={(e) => handleArrayChange('post', index, { title: e.target.value })}
                      placeholder="Post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <Input
                      value={post.image}
                      onChange={(e) => handleArrayChange('post', index, { image: e.target.value })}
                      placeholder="/post-image.jpg"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={post.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleArrayChange('post', index, { description: e.target.value })}
                      placeholder="Post description"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                      value={post.cta}
                      onChange={(e) => handleArrayChange('post', index, { cta: e.target.value })}
                      placeholder="Read More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={post.link}
                      onChange={(e) => handleArrayChange('post', index, { link: e.target.value })}
                      placeholder="/post-url"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Footer Links */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Footer Links
            </CardTitle>
            <CardDescription>Manage footer navigation links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {websiteData.footer_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...websiteData.footer_links]
                      newLinks[index] = e.target.value
                      handleInputChange('footer_links', newLinks)
                    }}
                    placeholder="Footer link"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLinks = websiteData.footer_links.filter((_, i) => i !== index)
                      handleInputChange('footer_links', newLinks)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newLinks = [...websiteData.footer_links, '']
                  handleInputChange('footer_links', newLinks)
                }}
              >
                Add Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Social Links
            </CardTitle>
            <CardDescription>Manage social media links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {websiteData.social_links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...websiteData.social_links]
                      newLinks[index] = e.target.value
                      handleInputChange('social_links', newLinks)
                    }}
                    placeholder="Social platform"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLinks = websiteData.social_links.filter((_, i) => i !== index)
                      handleInputChange('social_links', newLinks)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newLinks = [...websiteData.social_links, '']
                  handleInputChange('social_links', newLinks)
                }}
              >
                Add Social Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 