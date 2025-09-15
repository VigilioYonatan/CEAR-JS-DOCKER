import { Sequelize } from "sequelize";
import Logger from "../../libs/server/logger.js";
import UserEntity from "../../services/user/entities/user.entity.js";
import enviroments from "./environments.config.js";

const sequelize = new Sequelize({
    dialect: "postgres",
    host: enviroments.DB_NAME,
    username: enviroments.DB_USER,
    password: enviroments.DB_PASS,
    database: enviroments.DB_NAME,
    // port: enviroments.DB_PORT,
    pool: {
        max: 50,
        min: 15,
        acquire: 30000,
        idle: 30000,
        evict: 10000,
    },
    retry: {
        max: 3, // Intentar reconectar 3 veces
        match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
        ],
    },
    // dialectOptions: {
    //     useUTC: true, // Para MySQL/MariaDB
    //     timezone: "Etc/UTC", // para que las fechas se guarden en UTC
    //     connectTimeout: 10000, // 10 segundos para conexión inicial
    // },
    // timezone: "+00:00",
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        underscored: true, // para que las columnas se guarden en snake_case
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    },
    hooks: {
        beforeSave: (_instance) => {},
        beforeUpdate: (_instance) => {},
    },
});

const User = UserEntity(sequelize, Sequelize.DataTypes);

Object.keys(sequelize.models).forEach((modelName) => {
    if (sequelize.models[modelName].associate) {
        sequelize.models[modelName].associate(sequelize.models);
    }
});

export async function connectDB() {
    try {
        Logger.info("Intentando autenticar con la base de datos...");
        await sequelize.authenticate({
            logging: (sql, timing) => {
                Logger.debug(`SQL: ${sql}`);
                if (timing) {
                    Logger.debug(`Tiempo de ejecución: ${timing}ms`);
                }
            },
        });
        Logger.info(
            "Conexión a la base de datos establecida correctamete http://localhost:4000/api/seed"
        );
        if (enviroments.NODE_ENV === "production") {
            await sequelize.sync({ alter: true });
        }
        // se recimienda al final cuando ya acabaste tu aplicacion usar migraciones, por ahora usa sync.
        await sequelize.sync({
            logging: (sql, timing) => {
                Logger.debug(`SQL: ${sql}`);
                if (timing) {
                    Logger.debug(`Tiempo de ejecución: ${timing.toString()}ms`);
                }
            },
            // alter: true,
            // force: true,
        });
    } catch (error) {
        Logger.error("Error al conectar con la base de datos:", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
    }
}

export { sequelize, User };
