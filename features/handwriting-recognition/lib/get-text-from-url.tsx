import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Initialize the S3 client using environment variables
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

/**
 * Extracts bucket name and key from a full S3 URL.
 * @param {string} url - The full S3 URL.
 * @returns {{ bucketName: string, key: string }} An object containing the bucket name and key.
 * @throws {Error} If the URL is not a valid S3 URL.
 */
function parseS3Url(url: string): { bucketName: string, key: string } {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  if (!hostname.includes('s3') || !hostname.includes('amazonaws.com')) {
    throw new Error("Invalid S3 URL");
  }

  const bucketName = hostname.split('.')[0];
  const key = parsedUrl.pathname.slice(1); // Remove leading '/'

  return { bucketName, key };
}

/**
 * Retrieves text content from a file in an S3 bucket using its full URL.
 * @param {string} url - The full S3 URL of the file.
 * @returns {Promise<string>} The text content of the file.
 * @throws {Error} If there's an issue retrieving or reading the file.
 */
export async function getTextFromS3(fileUrl: string): Promise<string> {
  console.log('Attempting to fetch text for file URL:', fileUrl);
  
  try {
    const response = await fetch('/api/get-s3-file-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl }),
    });
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const text = await response.text();
    console.log('Retrieved text:', text.substring(0, 100) + '...'); // Log first 100 characters
    return text;
  } catch (error) {
    console.error('Error in getTextFromS3:', error);
    throw error;
  }
}
