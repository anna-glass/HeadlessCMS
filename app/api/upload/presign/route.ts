import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { stackServerApp } from '../../../stack';

const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;

if (!S3_BUCKET || !AWS_REGION) {
  throw new Error('S3_BUCKET_NAME and AWS_REGION environment variables are required');
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName, contentType } = await request.json();
    
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType are required' }, 
        { status: 400 }
      );
    }

    // Validate file type
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' }, 
        { status: 400 }
      );
    }

    const objectKey = `${randomUUID()}-${fileName}`;
    const publicFileUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({
      success: true,
      presignedUrl,
      objectKey,
      publicFileUrl
    });
  } catch (error) {
    console.error('Presign Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to prepare upload' }, 
      { status: 500 }
    );
  }
} 