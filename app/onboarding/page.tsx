//
// onboarding/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// onboarding page for new users to create organization
//

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Upload } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    slug: '',
    logo_url: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create organization');
      }

      // Redirect to main app after successful organization creation
      router.push('/');
    } catch (error) {
      console.error('Error creating organization:', error);
      alert(error instanceof Error ? error.message : 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="overflow-hidden p-0 max-w-screen-md w-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Welcome to Chapter Street</h1>
            </div>
            
            <CardDescription className="mb-6">
              Let's set up your organization to get started. This will help us personalize your experience.
            </CardDescription>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your organization name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain (Optional)</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="yourcompany.com"
                  value={formData.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  type="text"
                  placeholder="your-organization"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This will be used in your organization's URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL (Optional)</Label>
                <Input
                  id="logo_url"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !formData.name}
              >
                {isLoading ? 'Creating...' : 'Create Organization'}
              </Button>
            </form>
          </div>
          
          <div className="hidden md:block">
            <img
              src="/login.png"
              alt="Onboarding"
              className="dark:brightness-[0.2] dark:grayscale h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 