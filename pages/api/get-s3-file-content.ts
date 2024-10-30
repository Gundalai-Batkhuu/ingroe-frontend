import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileUrl } = req.body;

  if (!fileUrl || typeof fileUrl !== 'string') {
    return res.status(400).json({ error: 'File URL is required' });
  }

  try {
    console.log('Received file URL:', fileUrl);
    const { bucketName, key } = parseS3Url(fileUrl);
    console.log('Parsed S3 details:', { bucketName, key });

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    console.log('Sending S3 command:', command);
    const { Body } = await s3Client.send(command);
    const fileContent = await Body?.transformToString();

    if (!fileContent) {
      console.log('File content is empty');
      return res.status(404).json({ error: 'File not found or empty' });
    }

    console.log('File content retrieved successfully');
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error retrieving file from S3:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Error retrieving file from S3', details: errorMessage });
  }
}

function parseS3Url(url: string): { bucketName: string, key: string } {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  if (!hostname.includes('s3') || !hostname.includes('amazonaws.com')) {
    throw new Error("Invalid S3 URL");
  }

  const bucketName = hostname.split('.')[0];
  const key = decodeURIComponent(parsedUrl.pathname.slice(1)); // Remove leading '/' and decode

  return { bucketName, key };
}
