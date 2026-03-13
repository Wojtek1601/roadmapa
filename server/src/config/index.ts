import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production environment");
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-me",
  jwtExpiresIn: 86400, // 24 hours in seconds
};
