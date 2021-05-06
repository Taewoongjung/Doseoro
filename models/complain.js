const Sequelize = require('sequelize');

module.exports = class Complain extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title:{
                type: Sequelize.STRING(140),
                allowNull: true,
            },
            content: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            complainedId: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            complainedNick: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            isSettled: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: 0,
              },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Complain',
            tableName: 'complains',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
}