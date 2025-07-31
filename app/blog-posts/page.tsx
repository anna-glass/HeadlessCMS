//
// blog-posts/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// blog posts management page
//

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Upload, X, FileText } from 'lucide-react'
import { BlogPost } from '@/lib/types/website'
import { uploadFileToS3, validateImageFile } from '@/lib/s3-upload'
import { generateSlug } from '@/lib/utils'

export default function BlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [uploadingPosts, setUploadingPosts] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  // Load blog posts on mount
  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog-posts')
      if (response.ok) {
        const posts = await response.json()
        // Transform database posts to BlogPost format
        const transformedPosts = posts.map((post: any) => ({
          title: post.title,
          image: post.image_url || '',
          body: post.body || '',
          slug: post.slug
        }))
        setBlogPosts(transformedPosts)
      } else {
        console.error('Failed to load blog posts')
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, postIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file using utility function
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setUploadingPosts(prev => new Set([...prev, postIndex]))
    
    try {
      const uploadResult = await uploadFileToS3(file)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload image')
      }

      const newPosts = [...blogPosts]
      newPosts[postIndex] = { ...newPosts[postIndex], image: uploadResult.publicFileUrl! }
      setBlogPosts(newPosts)
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

  const addBlogPost = () => {
    setBlogPosts([...blogPosts, { title: '', image: '', body: '', slug: '' }])
  }

  const removeBlogPost = async (index: number) => {
    const postToRemove = blogPosts[index]
    
    // If the post has a slug and we're removing it, we should delete it from the database
    if (postToRemove.slug && postToRemove.title) {
      try {
        await fetch(`/api/blog-posts/${postToRemove.slug}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Error deleting blog post:', error)
      }
    }
    
    setBlogPosts(blogPosts.filter((_, i) => i !== index))
  }

  const updateBlogPost = (index: number, field: keyof BlogPost, value: string) => {
    const newPosts = [...blogPosts]
    if (field === 'title') {
      const newSlug = generateSlug(value)
      newPosts[index] = { ...newPosts[index], title: value, slug: newSlug }
    } else {
      newPosts[index] = { ...newPosts[index], [field]: value }
    }
    setBlogPosts(newPosts)
  }

  const saveBlogPost = async (post: BlogPost, index: number) => {
    if (!post.title) return

    try {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        const savedPost = await response.json()
        const newPosts = [...blogPosts]
        newPosts[index] = {
          title: savedPost.title,
          image: savedPost.image_url || '',
          body: savedPost.body || '',
          slug: savedPost.slug
        }
        setBlogPosts(newPosts)
        console.log('Blog post saved successfully')
      } else {
        console.error('Failed to save blog post')
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts content
          </p>
        </div>
        <Button onClick={addBlogPost} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Blog Post
        </Button>
      </div>

      <div className="space-y-6">
        {blogPosts.map((post, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Blog Post {index + 1}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveBlogPost(post, index)}
                    disabled={!post.title}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBlogPost(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={post.title}
                      onChange={(e) => updateBlogPost(index, 'title', e.target.value)}
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
                              onClick={() => updateBlogPost(index, 'image', '')}
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
                          <p className="text-xs text-gray-500 mb-2">PNG, JPG up to 2MB</p>
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
                        onChange={(e) => handleImageUpload(e, index)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    value={post.body}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateBlogPost(index, 'body', e.target.value)
                    }
                    placeholder="Post body"
                    rows={8}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {blogPosts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">No blog posts yet</h3>
                  <p className="text-gray-500">Get started by creating your first blog post.</p>
                </div>
                <Button onClick={addBlogPost} className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Add Blog Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 