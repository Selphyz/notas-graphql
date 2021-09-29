import dotenv from "dotenv";

dotenv.config();
export const CONST = {
    PORT: process.env.PORT!,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN!,
    LONG_ACCESS_TOKEN: process.env.LONG_ACCESS_TOKEN!,
    JWT_COOKIE: "notas-jwt"
};