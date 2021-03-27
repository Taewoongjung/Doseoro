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
            provider: { // kakao로 할 때는 kakao로 바뀜
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: { // 나중에 kakao로 연동할 때 카카오에서 snsnId를 아이디처럼 쓸 수 있기 때문에 저장하는 곳.
                type: Sequelize.STRING(30),
                allowNull: true, 
            }
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
        db.User.hasMany(db.Book);
    }
};