//
// ImageUpload.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// image upload component for products
//

'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadFileToS3, validateImageFile } from "@/lib/s3-upload";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(`File "${file.name}": ${validation.error}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add files to uploading state
    const fileNames = validFiles.map(f => f.name);
    setUploadingFiles(prev => new Set([...prev, ...fileNames]));

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const result = await uploadFileToS3(file);
        if (!result.success) {
          throw new Error(`Failed to upload ${file.name}: ${result.error}`);
        }
        return result.publicFileUrl!;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      // Remove files from uploading state
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        fileNames.forEach(name => newSet.delete(name));
        return newSet;
      });
    }
  }, [images, onChange]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Product Images</Label>
      {/* Upload Area */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        {uploadingFiles.size > 0 ? (
          <>
            <Loader2 className="mx-auto h-8 w-8 text-muted-foreground mb-2 animate-spin" />
            <p className="text-sm text-muted-foreground mb-2">
              Uploading {uploadingFiles.size} image{uploadingFiles.size !== 1 ? 's' : ''}...
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
            >
              Uploading...
            </Button>
          </>
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to select images
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
                input.click();
              }}
            >
              Select Images
            </Button>
          </>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
} 
