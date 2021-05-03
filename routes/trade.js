const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

router.post('/commentTrade', isLoggedIn, async (req, res, next) => {
    const { bookId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: bookId,
        }
    });
    console.log("책 아이디 = ", bookId);

    if (req.user.id === theBook.OwnerId) {
        console.log("aaa");
    }

});

module.exports = router;