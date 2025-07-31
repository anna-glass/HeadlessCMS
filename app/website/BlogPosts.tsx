//
// BlogPostsSection.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// blog posts section component for website builder
//

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileText, Plus } from 'lucide-react'
import { WebsiteData } from '@/lib/types/website'

interface BlogPostsProps {
  include_blog: boolean
  blog_posts: any[]
  onUpdate: (field: keyof WebsiteData, value: any) => void
}

export function BlogPosts({ 
  include_blog, 
  blog_posts, 
  onUpdate 
}: BlogPostsProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Blog Posts</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/blog-posts', '_blank')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Manage Posts
            </Button>
          </div>
          
          {blog_posts.length > 0 ? (
            <div className="space-y-3">
              {blog_posts.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="h-12 w-16 object-cover border rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{post.title || `Post ${index + 1}`}</h4>
                      <p className="text-sm text-muted-foreground">
                        {post.body ? `${post.body.substring(0, 50)}...` : 'No content'}
                      </p>
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
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-4">No blog posts selected</p>
              <p className="text-xs text-gray-400">
                Create and manage your blog posts in the Blog Posts section
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 