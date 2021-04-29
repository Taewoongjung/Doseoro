const express = require('express');
const multer = require('multer');
const path = require('path');

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

router.get('/witoutCommu', isLoggedIn, async(req, res, next) => {
    try{
        console.log("@!!!!");
        const { notCommunity_Id } = req.query;
        const a = await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: notCommunity_Id,
            },
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/onlyCommu', isLoggedIn, async(req, res, next) => {
    try{
        console.log("@!!!!");
        const { community_Id } = req.query;
        const a = await Post.update({
            isNotified_posts: '1',
        }, {
            where:{
                id: community_Id,
            },
        });
        console.log("asaaa = ", a);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;