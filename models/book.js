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
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            publisher: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            demaged: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            like: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            sold: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            about: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Book',
            tableName: 'books',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Book.belongsTo(db.User);
    }
};