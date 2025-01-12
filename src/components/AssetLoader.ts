type AssetType = 'image' | 'audio';

interface Asset {
  key: string;
  type: AssetType;
  url?: string;
  blob?: Blob;
  urlCreatedAt?: number; // Add timestamp when URL was created
}

class AssetLoader {
  private static instance: AssetLoader;
  private assetCache: Map<string, Asset>;
  private loadPromises: Map<string, Promise<Asset>>;
  private isLoading: boolean;
  private readonly URL_EXPIRATION_MS = 3600000; // 1 hour in milliseconds
  private readonly URL_REFRESH_THRESHOLD_MS = 300000; // 5 minutes before expiration

  private constructor() {
    this.assetCache = new Map();
    this.loadPromises = new Map();
    this.isLoading = false;
  }

  static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  private async fetchSignedUrl(key: string): Promise<string> {
    const response = await fetch(`/api/s3?key=${encodeURIComponent(key)}`);
    const data = await response.json();
    return data.url;
  }

  private isUrlExpiringSoon(asset: Asset): boolean {
    if (!asset.urlCreatedAt) return true;
    const timeSinceCreation = Date.now() - asset.urlCreatedAt;
    return timeSinceCreation > (this.URL_EXPIRATION_MS - this.URL_REFRESH_THRESHOLD_MS);
  }

  private async refreshAssetUrl(asset: Asset): Promise<Asset> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const signedUrl = await this.fetchSignedUrl(asset.key);
    if (asset.url) {
      URL.revokeObjectURL(asset.url); // Clean up old object URL
    }
    asset.url = URL.createObjectURL(asset.blob!);
    asset.urlCreatedAt = Date.now();
    return asset;
  }

  private async loadAsset(key: string, type: AssetType): Promise<Asset> {
    // Check if we have the asset cached and if the URL is not expiring soon
    if (this.assetCache.has(key)) {
      const cachedAsset = this.assetCache.get(key)!;
      if (!this.isUrlExpiringSoon(cachedAsset)) {
        return cachedAsset;
      }
      // If URL is expiring soon, refresh it
      return this.refreshAssetUrl(cachedAsset);
    }

    if (this.loadPromises.has(key)) {
      return this.loadPromises.get(key)!;
    }

    const loadPromise = (async () => {
      const signedUrl = await this.fetchSignedUrl(key);
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      
      const asset: Asset = {
        key,
        type,
        url: URL.createObjectURL(blob),
        blob,
        urlCreatedAt: Date.now()
      };
      
      this.assetCache.set(key, asset);
      this.loadPromises.delete(key);
      
      return asset;
    })();

    this.loadPromises.set(key, loadPromise);
    return loadPromise;
  }

  async preloadGameAssets(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    const gameAssets = [
      { key: 'baby-boy.png', type: 'image' as AssetType },
      { key: 'cat.png', type: 'image' as AssetType },
      { key: 'dog.png', type: 'image' as AssetType },
      { key: 'angry-cat.png', type: 'image' as AssetType },
      { key: 'angry-dog.png', type: 'image' as AssetType },
      { key: 'clouds.png', type: 'image' as AssetType },
      { key: 'dove.png', type: 'image' as AssetType },
      { key: 'tiles1.png', type: 'image' as AssetType }
    ];

    try {
      await Promise.all(gameAssets.map(asset => this.loadAsset(asset.key, asset.type)));
    } finally {
      this.isLoading = false;
    }
  }

  getAssetUrl(key: string): string | undefined {
    const asset = this.assetCache.get(key);
    if (!asset) return undefined;

    if (this.isUrlExpiringSoon(asset)) {
      // Start refresh process in background
      this.refreshAssetUrl(asset).catch(console.error);
    }
    
    return asset.url;
  }

  isAssetLoaded(key: string): boolean {
    return this.assetCache.has(key);
  }

  areAllAssetsLoaded(): boolean {
    return !this.isLoading && this.loadPromises.size === 0;
  }
}

export default AssetLoader;