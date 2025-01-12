"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AssetLoader from './AssetLoader';

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
    const assetLoader = AssetLoader.getInstance();
    const cachedUrl = assetLoader.getAssetUrl(imageKey);
    
    if (cachedUrl) {
      setImageUrl(cachedUrl);
      setIsLoading(false);
      return;
    }

    const loadAsset = async () => {
      try {
        setIsLoading(true);
        await assetLoader.preloadGameAssets();
        const url = assetLoader.getAssetUrl(imageKey);
        if (url) {
          setImageUrl(url);
        }
      } catch (error) {
        console.error('Error loading image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsset();
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