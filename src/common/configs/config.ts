export const configuration = () => ({
  env: process.env.NODE_ENV,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  sesApiVersion: process.env.SES_API_VERSION,
  sesEmailId: process.env.SES_EMAIL_ID,
  mongoURI: process.env.MONGO_URI,
  ipfsGateway: process.env.IPFS_GATEWAY,
});
