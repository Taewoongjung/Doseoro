const Sequelize = require('sequelize');

module.exports = class Who extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            thisbook: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            likedNick: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            posttitle:{
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            title: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            img: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            liked: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            thisURL: {  // 댓글을 달면 해당 url을 가져오기
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            bought: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            isNotified_like: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: 0,
              },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Who',
            tableName: 'whoes',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Who.belongsTo(db.User);
        db.Who.belongsTo(db.Book);
    }
};
