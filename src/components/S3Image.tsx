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

export default function S3Image({ imageKey, alt, width, height, className, style }: S3ImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/s3?key=${encodeURIComponent(imageKey)}`);
        const data = await response.json();
        
        if (data.url) {
          setImageUrl(data.url);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching signed URL:', error);
        setIsLoading(false);
      }
    };

    fetchSignedUrl();
  }, [imageKey]);

  if (isLoading || !imageUrl) {
    return <div className="animate-pulse bg-gray-200" style={{ width, height }}></div>;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}