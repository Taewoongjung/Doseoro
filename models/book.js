const Sequelize = require('sequelize');

module.exports = class Book extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            postmessage: {
                type: Sequelize.STRING(150),
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            title: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            author: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            publisher: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            category: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            state: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            tradingmethod: {
                type: Sequelize.STRING(15),
                allowNull: true,
            },
            img: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            likecount: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            sold: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            about: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            usernick: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            hits: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            isSelling: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Book',
            tableName: 'books',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Book.belongsTo(db.User, { as: 'Owner' });
        db.Book.belongsTo(db.User, { as: 'Sold' });
        db.Book.hasMany(db.Who);
        db.Book.hasMany(db.Post);
    }
};