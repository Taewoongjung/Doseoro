const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: true,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING(14),
                allowNull: true,
            },
            question: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            answer: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            liked: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING(150),
                allowNull: true,
            },
            dong: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            si: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            do: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true, 
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Who);
        db.User.hasMany(db.Post);
    }
};