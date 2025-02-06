const process = require("process");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


// AWS S3 Client Configuration
 const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload image to S3
const uploadImageToS3 = async (file) => {
  const fileContent = file.buffer;
  const fileKey = `content-images/${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Error uploading image to S3");
  }
};

module.exports = uploadImageToS3;
