require('dotenv').config()

export const ENVS = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    PORT: process.env.port || 8080,
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME
  }

