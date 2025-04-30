const config = {
  app: {
    GC_API: process.env.GC_API || "https://classroom.googleapis.com/v1",
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  db: {
    DB_URI: process.env.DB_URI,
    DB_NAME: process.env.DB_NAME || 'peerlearning',
  },
  security: {
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS) || 10,
  },
  limits: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE) || 10485760, // 10MB default
  },
};

module.exports = config;