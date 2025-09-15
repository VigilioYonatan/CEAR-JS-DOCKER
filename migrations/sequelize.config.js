import dotenv from "dotenv";
dotenv.config({ path: ".env" });
export default {
    host: process.env.DB_HOST || process.env.DB_HOST,
    port: process.env.DB_PORT || process.env.DB_PORT,
    username: process.env.DB_USER || process.env.DB_USER,
    password: process.env.DB_PASS || process.env.DB_PASS,
    database: process.env.DB_NAME || process.env.DB_NAME,
    dialect: "postgres",
    // dialectOptions: {
    //     useUTC: true,
    //     timezone: "Etc/UTC",
    // },
    // timezone: "+00:00",
    logging: process.env.NODE_ENV === "development" ? console.log : false, // Solo en desarrollo
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    },
};
