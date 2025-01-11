export async function loadAudioFromS3(key: string): Promise<string> {
  try {
    const response = await fetch(`/api/s3?key=${encodeURIComponent(key)}`);
    const data = await response.json();
    
    if (data.url) {
      return data.url;
    }
    throw new Error('No URL returned from S3');
  } catch (error) {
    console.error('Error loading audio from S3:', error);
    throw error;
  }
}