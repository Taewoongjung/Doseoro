const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 구매하기 댓글에 구매완료 적용
router.post('/commentTrade_sale', isLoggedIn, async (req, res, next) => {
    console.log("trade/commentTrade_sale 진입");

    const { bookId, UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: bookId,
        }
    });

    const theComment = await Post.findOne({
        where:{
            UserId: UserId,
        }
    });

    if (req.user.id === theBook.OwnerId) {
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({
                sold: 1,
                SoldId: UserId,
            }, {
                where: { id: theBook.id},
            });
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tradeHistory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/book/${bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/book/${bookId}";</script>`);
    }
});

// 구매하기 답글에 구매완료 적용
router.post('/reCommentTrade_sale', isLoggedIn, async (req, res, next) => {
    console.log("trade/reCommentTrade_sale 진입");

    const { re_bookId, recomment_UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: re_bookId,
        }
    });

    const theComment = await Post.findOne({
        where:{
            UserId: recomment_UserId,
        }
    });

    if (req.user.id === theBook.OwnerId) {
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({
                sold: 1,
                SoldId: recomment_UserId,
            }, {
                where: { id: theBook.id},
            });                            
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/book/${re_bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/book/${re_bookId}";</script>`);
    }
});

// 삽니다 댓글에 구매완료 적용
router.post('/commentTrade_buy', isLoggedIn, async (req, res, next) => {
    console.log("trade/commentTrade_buy 진입");

    const { bookId, UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: bookId,
        }
    });

    const theComment = await Post.findOne({
        where:{
            UserId: UserId,
        }
    });

    if (req.user.id === theBook.OwnerId) {
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({
                sold: 1,
                SoldId: UserId,
            }, {
                where: { id: theBook.id},
            });
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/wannabuy/buybook/${bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/wannabuy/buybook/${bookId}";</script>`);
    }
});

// 삽니다 답글에 구매완료 적용
router.post('/reCommentTrade_buy', isLoggedIn, async (req, res, next) => {
    console.log("trade/reCommentTrade_buy 진입");

    const { re_bookId, recomment_UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: re_bookId,
        }
    });

    const theComment = await Post.findOne({
        where:{
            UserId: recomment_UserId,
        }
    });

    if (req.user.id === theBook.OwnerId) {
        if ( req.user.id !== theComment.UserId ) {
            await Book.update({
                sold: 1,
                SoldId: recomment_UserId,
            }, {
                where: { id: theBook.id},
            });
            return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/tory";</script>`);
        } else {
            return res.send(`<script type="text/javascript">alert("잘못된 접근 입니다.(자신한테 거래)"); location.href="/wannabuy/buybook/${re_bookId}";</script>`);
        }
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/wannabuy/buybook/${re_bookId}";</script>`);
    }
});

module.exports = router;