const Sequelize = require('sequelize');

// 책 좋아요 누를 때 연동 addFollowings...

module.exports = class Book extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
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
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            demaged: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            state: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            like: {
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
        db.Book.hasMany(db.Whobot);
    }
};