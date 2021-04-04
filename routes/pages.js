const express = require('express');
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

router.get('/saleBoard', (req, res) => {
    res.render('saleBoard.html');
})

module.exports = router;