const Sequelize = require('sequelize');

module.exports = class Chat extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            nick: {
                type: Sequelize.STRING(15),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Chat',
            tableName: 'chat',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Chat.belongsTo(db.User, { as: 'Sender' });
        db.Chat.belongsTo(db.User, { as: 'Receiver' });
    }
};