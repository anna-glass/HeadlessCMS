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
import { Plus, X, Edit, Calendar } from 'lucide-react'
import { BlogPost } from '@/lib/types/website'
import BlogPostModal from './BlogPostModal'

export default function BlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

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
          slug: post.slug,
          created_at: post.created_at,
          is_published: post.is_published
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

  const handleAdd = (newPost: BlogPost) => {
    setBlogPosts([newPost, ...blogPosts])
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setEditModalOpen(true)
  }

  const handlePostUpdated = (updatedPost: BlogPost) => {
    setBlogPosts(blogPosts.map(p => p.slug === updatedPost.slug ? updatedPost : p))
  }

  const deleteBlogPost = async (post: BlogPost) => {
    if (!post.slug) return
    
    try {
      await fetch(`/api/blog-posts/${post.slug}`, {
        method: 'DELETE',
      })
      setBlogPosts(blogPosts.filter(p => p.slug !== post.slug))
    } catch (error) {
      console.error('Error deleting blog post:', error)
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
        <BlogPostModal
          mode="add"
          onPostAdded={handleAdd}
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Blog Post
            </Button>
          }
        />
      </div>

      {/* Blog Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <Card key={post.slug || index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Image */}
                {post.image && (
                  <div className="aspect-[4/3] overflow-hidden rounded-lg max-h-12">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.body || 'No content'}
                  </p>
                </div>
                
                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'}
                  </div>
                  <div className="flex items-center gap-1">
                    {post.is_published ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-orange-600">Draft</span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBlogPost(post)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty State */}
      {blogPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No blog posts yet</h3>
                <p className="text-gray-500">Get started by creating your first blog post.</p>
              </div>
              <BlogPostModal
                mode="add"
                onPostAdded={handleAdd}
                trigger={
                  <Button className="flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />
                    New Blog Post
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <BlogPostModal
        mode="edit"
        post={editingPost}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  )
} 