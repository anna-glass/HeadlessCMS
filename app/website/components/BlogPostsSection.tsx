'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Upload, X } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'

// Utility function to generate slugs
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

interface BlogPost {
  title: string
  image: string
  body: string
  slug: string
}

interface BlogPostsSectionProps {
  include_blog: boolean
  blog_posts: BlogPost[]
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function BlogPostsSection({ 
  include_blog, 
  blog_posts, 
  onUpdate 
}: BlogPostsSectionProps) {
  const [uploadingPosts, setUploadingPosts] = useState<Set<number>>(new Set())

  const handleImageUpload = async (file: File, postIndex: number) => {
    if (!file) return

    setUploadingPosts(prev => new Set([...prev, postIndex]))
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const newPosts = [...blog_posts]
      newPosts[postIndex] = { ...newPosts[postIndex], image: data.url }
      onUpdate('blog_posts', newPosts)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postIndex)
        return newSet
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, postIndex: number) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file, postIndex)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Blog Posts
            </CardTitle>
            <CardDescription>Manage your blog posts content</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include_blog"
              checked={include_blog}
              onCheckedChange={(checked: boolean) => onUpdate('include_blog', checked)}
            />
            <Label htmlFor="include_blog">Include Blog Posts</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {include_blog && (
            <div className="space-y-4">
              {blog_posts.map((post, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">Post {index + 1}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={post.title}
                          onChange={(e) => {
                            const newPosts = [...blog_posts]
                            const newTitle = e.target.value
                            const newSlug = generateSlug(newTitle)
                            newPosts[index] = { ...post, title: newTitle, slug: newSlug }
                            onUpdate('blog_posts', newPosts)
                          }}
                          placeholder="Post title"
                        />
                        {post.slug && (
                          <p className="text-xs text-muted-foreground">Slug: {post.slug}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="space-y-2">
                          {post.image ? (
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <img 
                                  src={post.image} 
                                  alt={`Post ${index + 1} image`} 
                                  className="h-16 w-20 object-cover border rounded"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="absolute -top-1 -right-1 h-5 w-5 p-0"
                                  onClick={() => {
                                    const newPosts = [...blog_posts]
                                    newPosts[index] = { ...post, image: '' }
                                    onUpdate('blog_posts', newPosts)
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground truncate">{post.image}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-300 rounded p-3 text-center">
                              <Upload className="mx-auto h-4 w-4 text-gray-400 mb-1" />
                              <p className="text-xs text-gray-600 mb-1">Upload image</p>
                              <p className="text-xs text-gray-500 mb-2">PNG, JPG, SVG up to 5MB</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`post-image-upload-${index}`)?.click()}
                                disabled={uploadingPosts.has(index)}
                              >
                                {uploadingPosts.has(index) ? 'Uploading...' : 'Choose File'}
                              </Button>
                            </div>
                          )}
                          <input
                            id={`post-image-upload-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, index)}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Body</Label>
                      <Textarea
                        value={post.body}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newPosts = [...blog_posts]
                          newPosts[index] = { ...post, body: e.target.value }
                          onUpdate('blog_posts', newPosts)
                        }}
                        placeholder="Post body"
                        rows={8}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPosts = blog_posts.filter((_, i) => i !== index)
                      onUpdate('blog_posts', newPosts)
                    }}
                  >
                    Remove Post
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newPosts = [...blog_posts, { title: '', image: '', body: '', slug: '' }]
                  onUpdate('blog_posts', newPosts)
                }}
              >
                Add Blog Post
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 