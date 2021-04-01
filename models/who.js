const Sequelize = require('sequelize');

module.exports = class Who extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            thisbook: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            posttitle:{
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            liked: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            bought: {
                type: Sequelize.STRING(100),
                allowNull: true,
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
