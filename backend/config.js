import { config } from "dotenv";
config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
export const CLOUD_NAME = process.env.CLOUD_NAME;

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_NAME = process.env.ADMIN_NAME
export const ADMIN_LASTNAME = process.env.ADMIN_LASTNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD