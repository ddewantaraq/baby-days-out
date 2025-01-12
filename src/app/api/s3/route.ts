import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Image key is required' },
        { status: 400 }
      );
    }

    // Check if S3_BUCKET environment variable is set
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error('S3_BUCKET environment variable is not set');
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    // Generate a presigned URL that expires in 3600 seconds (1 hour)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    
    // Check if raw URL is requested (for CSS background-image)
    const raw = searchParams.get('raw') === 'true';
    if (raw) {
      return new Response(signedUrl, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}