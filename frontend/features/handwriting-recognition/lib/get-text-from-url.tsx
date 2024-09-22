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
export async function getTextFromS3(url: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_AWS_REGION) {
    throw new Error("AWS Region is not set");
  }

  try {
    const { bucketName, key } = parseS3Url(url);

    // Set up the command to get the object
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Send the command to S3
    const response = await s3Client.send(command);

    if (response.Body instanceof ReadableStream) {
      const reader = response.Body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const allUint8Arrays = new Uint8Array(chunks.reduce((acc, val) => acc + val.length, 0));
      let position = 0;
      for (const chunk of chunks) {
        allUint8Arrays.set(chunk, position);
        position += chunk.length;
      }
      return new TextDecoder().decode(allUint8Arrays);
    } else if (response.Body instanceof Blob) {
      return await response.Body.text();
    } else {
      throw new Error("Unexpected response body type");
    }
  } catch (error) {
    console.error("Error retrieving text from S3:", error);
    throw error;
  }
}