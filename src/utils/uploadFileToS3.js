const ApiError = require("./apiError");
const httpStatus = require("http-status");
const dotenv = require("dotenv");
dotenv.config();
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID || ""),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY || ""),
  },
  forcePathStyle: false,
});

const uploadToCloud = async (file, keyPrefix = "products") => {
  try {
    if (!file) throw new ApiError(httpStatus.BAD_REQUEST, "File not found");

    const safeFileName = file.originalname.replace(/\s+/g, "_");
    const key = `${keyPrefix}/THEERA_${Date.now()}_${safeFileName}`;

    const params = {
      Bucket: "facesync",
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    console.log("🚀 Uploading to DigitalOcean:", key);

    const parallelUploads3 = new Upload({
      client: s3Client,
      params,
    });

    const uploadedData = await parallelUploads3.done();

    let fileUrl = uploadedData.Location;
    if (!fileUrl) {
      const endpoint = process.env.AWS_ENDPOINT
        ? process.env.AWS_ENDPOINT.replace(/^https?:\/\//, "")
        : "";
      fileUrl = `https://${params.Bucket}.${endpoint}/${key}`;
    } else if (!fileUrl.startsWith("https://") && !fileUrl.startsWith("http://")) {
      fileUrl = `https://${fileUrl}`;
    }

    console.log("✅ Uploaded successfully:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Upload failed, please try again"
    );
  }
};

const deleteFolderFromS3 = async (folderName, bucketName = "facesync") => {
  let isTruncated = true;
  let continuationToken = undefined;

  while (isTruncated) {
    const listParams = {
      Bucket: bucketName,
      Prefix: folderName,
      ContinuationToken: continuationToken,
    };

    const data = await s3Client.send(new ListObjectsV2Command(listParams));

    if (!data.Contents || data.Contents.length === 0) {
      break;
    }

    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: data.Contents.map(({ Key }) => ({ Key })),
      },
    };

    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    isTruncated = Boolean(data.IsTruncated);
    continuationToken = data.NextContinuationToken;
  }
};

const deleteFileFromS3 = async (fileUrl, bucketName = "facesync") => {
  const params = {
    Bucket: bucketName,
    Key: fileUrl,
  };

  await s3Client.send(new DeleteObjectCommand(params));
};

const calculateFolderSize = async (folderName) => {
  let totalSize = 0;
  const bucketName = "facesync";
  let isTruncated = true;
  let continuationToken = undefined;

  while (isTruncated) {
    const params = {
      Bucket: bucketName,
      Prefix: folderName,
      ContinuationToken: continuationToken,
    };

    const data = await s3Client.send(new ListObjectsV2Command(params));

    if (data.Contents && data.Contents.length > 0) {
      data.Contents.forEach((obj) => {
        totalSize += obj.Size || 0;
      });
    }

    isTruncated = Boolean(data.IsTruncated);
    continuationToken = data.NextContinuationToken;
  }

  return totalSize;
};

const convertSize = (sizeInBytes) => {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return {
    size: parseFloat(size.toFixed(2)),
    unit: units[unitIndex],
  };
};

module.exports = {
  s3: s3Client,
  s3Client,
  uploadToCloud,
  calculateFolderSize,
  convertSize,
  deleteFolderFromS3,
  deleteFileFromS3,
};
