const express = require('express');

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
        const books = await Who.findAll({ where: { liked: req.user.id } });
        res.render('likedProduct.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


// 0407 판매내역 창
router.get('/selling', isLoggedIn, async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { OwnerId: req.user.id } });
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


module.exports = router;