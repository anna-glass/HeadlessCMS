//
// s3-upload.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// S3 upload utility functions
//

export interface S3UploadResult {
  success: boolean;
  publicFileUrl?: string;
  objectKey?: string;
  organizationId?: string;
  error?: string;
}

export async function uploadFileToS3(file: File): Promise<S3UploadResult> {
  try {
    // Step 1: Get presigned URL
    const presignResponse = await fetch('/api/upload/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
      }),
    })

    if (!presignResponse.ok) {
      const error = await presignResponse.json()
      throw new Error(error.error || 'Failed to prepare upload')
    }

    const { presignedUrl, objectKey, publicFileUrl } = await presignResponse.json()

    // Step 2: Upload file directly to S3 using presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to S3')
    }

    // Step 3: Save metadata (optional, for tracking)
    const metadataResponse = await fetch('/api/upload/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        objectKey,
        publicFileUrl,
        fileSize: file.size,
      }),
    })

    if (!metadataResponse.ok) {
      throw new Error('Failed to save metadata')
    }

    const metadataResult = await metadataResponse.json()

    return {
      success: true,
      publicFileUrl,
      objectKey,
      organizationId: metadataResult.organizationId,
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' }
  }

  // Validate file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 2MB' }
  }

  return { valid: true }
} 