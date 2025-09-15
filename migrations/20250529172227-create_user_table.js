/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            "usuario",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING(100),
                    unique: true,
                },
                lastname: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                age: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING(200),
                    allowNull: false,
                },
                genero: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                address: {
                    type: Sequelize.JSON,
                    allowNull: false,
                },
                fecha: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                estado: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                deleted_at: {
                    allowNull: true,
                    type: Sequelize.DATE,
                    defaultValue: null,
                },
            },
            { paranoid: true }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("usuario");
    },
};
