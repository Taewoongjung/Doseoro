const express = require('express');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.render('index.html');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', (req, res) => {
    res.render('login.html');
});

router.get('/signup', (req, res) => {
    res.render('signup.html');
});


module.exports = router;