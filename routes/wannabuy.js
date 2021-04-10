const express = require('express');
const multer = require('multer');
const path = require('path');

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0407 판매내역 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id } = req.body;
        const books = await Book.findOne({ where: { id: this_item_id } });
        res.render('edit_saleDetail.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;