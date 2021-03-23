const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password, money } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?joinError=이미 가입된 이메일입니다.');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
            phone,
            answer,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;