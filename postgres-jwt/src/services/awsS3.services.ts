import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import dotenv from 'dotenv'

dotenv.config()

// console.log(process.env.BUCKET_NAME)
const s3Client = new S3Client({
    region: process.env.BUCKET_REGION as string,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_ACCESS_SECRET as string
    },
    apiVersion: '2006-03-01',
    useAccelerateEndpoint: false,
})  
// console.log(s3) xz


export const uploadFile = async (file: Express.Multer.File, key: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME as string,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });
 try {
    await s3Client.send(command)
    return `https://${process.env.BUCKET_NAME as string}.s3.${process.env.BUCKET_REGION as string}.amazonaws.com/${key}`
 } catch (error) { 
    console.error("error uploading:", error as Error)
    throw new Error("Error uploading file to s3");
 }
 
}

export const getFileUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME as string,
    Key: key
  });
  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return url;
} catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate file URL');
}
}



export const deleteFile = async (key: string) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: key,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw new Error('Failed to delete file from S3');
    }
};