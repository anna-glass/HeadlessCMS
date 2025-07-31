//
// upload/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// file upload api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
      }

      // For now, we'll use a placeholder service
      // In a real app, you'd upload to Cloudinary, AWS S3, etc.
      // For demonstration, we'll create a data URL
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      uploadedUrls.push(dataUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
} 