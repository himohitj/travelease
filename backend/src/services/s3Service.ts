import AWS from 'aws-sdk';
import { logger } from '../utils/logger';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  contentType: string = 'application/octet-stream'
): Promise<string> => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME not configured');
    }

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    logger.info(`File uploaded to S3: ${result.Location}`);
    
    return result.Location;

  } catch (error) {
    logger.error('S3 upload error:', error);
    throw error;
  }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME not configured');
    }

    const params = {
      Bucket: bucketName,
      Key: key
    };

    await s3.deleteObject(params).promise();
    logger.info(`File deleted from S3: ${key}`);

  } catch (error) {
    logger.error('S3 delete error:', error);
    throw error;
  }
};

export const getSignedUrl = async (key: string, expires: number = 3600): Promise<string> => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    
    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME not configured');
    }

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expires
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;

  } catch (error) {
    logger.error('S3 signed URL error:', error);
    throw error;
  }
};