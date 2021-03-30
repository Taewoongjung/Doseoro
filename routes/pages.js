const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/regi-book', isLoggedIn, (req, res) => {
    res.render('book.html');
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

module.exports = router;