const express = require('express');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require("sequelize");

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

const upload = multer({  // multer 설정
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 파일 덮어씌어지는거 방지
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 0415 무료나눔
router.post('/book', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { postmessage, title, price, author, publisher, checkCategory, checkState, dealRoot, about } = req.body;
        const book = await Book.create({
            OwnerId: req.user.id,
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            img: req.file.filename,
            category: checkCategory,
            state: checkState,
            price: -1,
            tradingmethod: dealRoot,
            about: about,
            usernick: req.user.nick,
        });
        res.send(`<script type="text/javascript">alert("무료나눔 등록 완료"); location.href="/book/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 무료나눔내역 삭제
router.get('/delete', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, this_item_createdAt, this_item_OwnerId } = req.query;
        await Book.destroy({ where: { id: this_item_id, createdAt: this_item_createdAt, OwnerId: this_item_OwnerId }, });
        res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/myPostingList";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 무료나눔 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id } = req.body;
        const books = await Book.findOne({ where: { id: this_item_id, price: -1 } });
        console.log("books = ", books);
        res.render('edit_freeDetail.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 무료나눔요청 게시물 수정하기
router.post('/edit', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id, postmessage, title, author, publisher, checkCategory, dealRoot, about } = req.body;
        console.log("body = ", req.body);
        const a = await Book.update({
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            category: checkCategory,
            tradingmethod: dealRoot,
            about: about,
        }, {
            where: { id: this_item_id, price: -1 }
        });
        console.log("body = ", req.body);
        console.log("aa = ", a);

        res.send(`<script type="text/javascript">alert("구매하기 정보 수정 완료"); location.href="/book/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0415 커뮤니티 등록
router.post('/community', isLoggedIn, async (req, res, next) => {
    try {
        const { postTitle, postAbout } = req.body;
        const commu = await Community.create({
            title: postTitle,
            content: postAbout,
        });
        res.send(`<script type="text/javascript">alert("게시물 등록 완료"); location.href="/book/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 커뮤니티 댓글 달기
router.post('/community/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const { comment } = req.body;
        console.log("comment = ", comment);
        const post = await Post.create({
            content: comment,
            commentingNick: req.user.nick,
            UserId: req.user.id,
            BookId: req.params.id,
        });
        return res.send(`<script type="text/javascript">location.href="/wannabuy/buybook/${post.BookId}";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;