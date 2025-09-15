import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const enviroments = {
	NODE_ENV: process.env.NODE_ENV,
	VITE_ENV: process.env.VITE_ENV,
	PORT: Number(process.env.PORT),
	// db
	DB_HOST: process.env.DB_HOST,
	DB_PORT: Number(process.env.DB_PORT),
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,

	// jwt
	JWT_KEY: process.env.JWT_KEY,
	VITE_HMAC_KEY: process.env.VITE_HMAC_KEY,

	VITE_URL: process.env.VITE_URL,
	VITE_PORT: process.env.VITE_PORT,
};

export default enviroments;
