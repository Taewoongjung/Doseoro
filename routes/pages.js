const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

router.get('/regi-book', isLoggedIn, (req, res) => {
    res.render('registerBook.html');
})

router.get('/findID', isNotLoggedIn, (req, res) => {
    res.render('findID.html');
});

router.get('/findPW', isNotLoggedIn,  (req, res) => {
    res.render('findPW.html');
});

router.get('/changePW', isNotLoggedIn, (req, res) => {
    res.render('changePW.html');
})

router.get('/saleBoard', async (req, res) => {
    try {
        const [books] = await Promise.all([
            Book.findAll({ where: { isSelling: null } }),
        ]);
        res.render('saleBoard.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// 0403 관심상품 창
router.get('/like', isLoggedIn, async (req, res, next) => {
    try {
        console.log("user id = ", String(req.user.id));
        const [books] = await Promise.all([
            Who.findAll({ 
                where: { liked: String(req.user.id),
                    price: {
                        [Op.ne]: -1
                    },
                }, 
            }),
        ]);
        const [free_books] = await Promise.all([
            Who.findAll({
                where: { liked: String(req.user.id), price: -1, },
            })
        ]);
        console.log("free = ", free_books);
        res.render('likedProduct.html', {
            books,
            free_books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0410 구매내역 창
router.get('/buying', isLoggedIn, async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { OwnerId: req.user.id, isSelling: '1'} });
        res.render('buyingList.html', {
            books,
            // createdAt: moment(books.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0407 판매내역 창
router.get('/selling', isLoggedIn, async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { OwnerId: req.user.id, isSelling: null} });
        res.render('sellingList.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0408 프로필
router.get('/myProfile', isNotLoggedIn, (req,res) => {
    res.render('myProfile.html');
});

// 0409 삽니다 등록
router.get('/registRequest', isLoggedIn, (req,res) => {
    res.render('registRequest.html');
});

// 0409 삽니다
router.get('/bookRequest', async (req, res, next) => {
    try {
        const [books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: '1' }
            })
        ]);
        res.render('bookRequest.html', {
            books,
            // createdAt: moment(books.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// 0414 작성한 글 목록
router.get('/myPostingList', isLoggedIn, async (req,res) => {
    try {
        const [wantsell_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, isSelling: null } }),
        ]);
        const [wantbuy_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, isSelling: '1'}}),
        ]);
        const [free_books] = await Promise.all([
            Book.findAll({where: { OwnerId: req.user.id, SoldId: null, isSelling: null, price: -1 }}),
        ]);
        res.render('myPostingList.html', {
            wantsell_books,
            wantbuy_books,
            free_books
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0414 무료나눔
router.get('/donationBoard', async (req,res) => {
    try {
        const [free_books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: null, price: -1 },
            })
        ]);
        res.render('donationBoard.html', {
            free_books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


// 0414 나눔 등록
router.get('/registDonation', isLoggedIn, (req,res) => {
    res.render('registDonation.html');
});

// 0414 커뮤니티
router.get('/community', (req,res) => {
    res.render('community.html');
});

// 0414 커뮤니티 등록
router.get('/registCommunity', isLoggedIn, (req,res) => {
    res.render('registCommunity.html');
});

module.exports = router;