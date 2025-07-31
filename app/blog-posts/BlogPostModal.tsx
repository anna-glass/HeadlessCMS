//
// BlogPostModal.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// blog post modal component for adding/editing blog posts
//

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BlogPost } from '@/lib/types/website'
import { uploadFileToS3, validateImageFile } from '@/lib/s3-upload'
import { generateSlug } from '@/lib/utils'
import { Upload, X } from 'lucide-react'

interface BlogPostModalProps {
  mode: 'add' | 'edit';
  post?: BlogPost | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPostAdded?: (post: BlogPost) => void;
  onPostUpdated?: (post: BlogPost) => void;
  trigger?: React.ReactNode;
}

export default function BlogPostModal({ 
  mode,
  post,
  open,
  onOpenChange,
  onPostAdded,
  onPostUpdated,
  trigger
}: BlogPostModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    body: '',
    slug: '',
    created_at: '',
    is_published: false
  });

  // Use controlled or uncontrolled open state
  const modalOpen = open !== undefined ? open : isOpen;
  const setModalOpen = onOpenChange || setIsOpen;

  // Update form data when post changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && post) {
      setFormData({
        title: post.title,
        image: post.image,
        body: post.body,
        slug: post.slug,
        created_at: post.created_at || '',
        is_published: post.is_published || false
      });
    } else if (mode === 'add') {
      // Reset form for add mode
      setFormData({
        title: '',
        image: '',
        body: '',
        slug: '',
        created_at: '',
        is_published: false
      });
    }
  }, [mode, post]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'title') {
      const newSlug = generateSlug(value as string);
      setFormData(prev => ({
        ...prev,
        title: value as string,
        slug: newSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file using utility function
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadResult = await uploadFileToS3(file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload image');
      }

      setFormData(prev => ({
        ...prev,
        image: uploadResult.publicFileUrl!
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${mode} blog post`);
      }

      const result = await response.json();
      const savedPost = {
        title: result.title,
        image: result.image_url || '',
        body: result.body || '',
        slug: result.slug,
        created_at: result.created_at,
        is_published: result.is_published
      };
      
      if (mode === 'add' && onPostAdded) {
        onPostAdded(savedPost);
      } else if (mode === 'edit' && onPostUpdated) {
        onPostUpdated(savedPost);
      }

      setModalOpen(false);
    } catch (error) {
      console.error(`Error ${mode}ing blog post:`, error);
      alert(error instanceof Error ? error.message : `Failed to ${mode} blog post`);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Blog Post' : 'New Blog Post';
  const description = isEditMode ? 'Update the blog post details below.' : 'Fill out the details below to create a new blog post.';
  const submitText = isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post');

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog post title"
                required
              />
              {formData.slug && (
                <p className="text-xs text-muted-foreground">Slug: {formData.slug}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Featured Image</Label>
              <div className="space-y-2">
                {formData.image ? (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img 
                        src={formData.image} 
                        alt="Post image" 
                        className="h-16 w-20 object-cover border rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0"
                        onClick={() => handleInputChange('image', '')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
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
                      onClick={() => document.getElementById('post-image-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Choose File'}
                    </Button>
                  </div>
                )}
                <input
                  id="post-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="body">Content</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Write your blog post content here..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title}>
              {submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 