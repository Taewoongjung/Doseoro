const express = require('express');

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0407 판매내역 삭제
router.get('/selling/delete', isLoggedIn, async (req, res, next) => {
    try {
        console.log("@@@!@!@!@!");
        // const books = await Book.findOne({ where: { OwnerId: req.user.id } });
        // res.render('sellingList.html', {
        //     books,
        // });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;