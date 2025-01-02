"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface S3ImageProps {
  imageKey: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function S3Image({ imageKey, alt, width, height, className }: S3ImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const response = await fetch(`/api/s3?key=${encodeURIComponent(imageKey)}`);
        const data = await response.json();
        
        if (data.url) {
          setImageUrl(data.url);
        }
      } catch (error) {
        console.error('Error fetching signed URL:', error);
      }
    };

    fetchSignedUrl();
  }, [imageKey]);

  if (!imageUrl) {
    return <div>Loading...</div>;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}