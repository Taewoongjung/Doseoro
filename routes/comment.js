const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0403 댓글 수정
router.get('/commentEdit', async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const posts = await Post.findOne({ where: { id: commentId } });
        res.render('saleDetail.html', {
            title: 'NodeBird',
            comments: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
      }
});


module.exports = router;