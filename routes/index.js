const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기 위함
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        res.render('index.html');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login.html');
});

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('signup.html');
});

// 0327 판매 게시판, 판매 게시물 등록
router.get('/saleDetail', isNotLoggedIn, (req, res) => {
    res.render('saleDetail.html');
});
router.get('/saleBoard', isNotLoggedIn, (req, res) => {
    res.render('saleBoard.html');
});

router.get('/mypage', isLoggedIn, (req, res) => {
    res.render('myPage.html');
});

module.exports = router;