import bcrypt from "bcryptjs";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class User extends Model {
        static associate() {
            // User.hasMany(models.Post, {
            //     foreignKey: "userId",
            //     as: "posts",
            // });
        }
        async validPassword(password) {
            const comparePassword = await bcrypt.compare(
                password,
                this.password
            );
            return comparePassword;
        }
    }

    User.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastname: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            address: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
            },
            genero: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            fecha: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "user",
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt();
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed("password")) {
                        const salt = await bcrypt.genSalt();
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
            },
        }
    );

    return User;
};
