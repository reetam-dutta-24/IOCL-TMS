import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "iocl-tms-documents"

export async function uploadFile(file: Buffer, key: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    await s3Client.send(command)
    return { success: true, key }
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    throw new Error("Failed to upload file")
  }
}

export function generateFileKey(userId: string, fileName: string, folder = "documents") {
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
  return `${folder}/${userId}/${timestamp}-${sanitizedFileName}`
}

export async function getFileUrl(key: string, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error("Error generating signed URL:", error)
    throw new Error("Failed to generate file URL")
  }
}

export async function deleteFile(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
    return { success: true }
  } catch (error) {
    console.error("Error deleting file from S3:", error)
    throw new Error("Failed to delete file")
  }
}
