const express = require('express');
const passport = require('passport');
const sanitize = require('sanitize-html');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const { name, phone, nick, email, password, answer, re_password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email: email } });
        if (exUser) {
            return res.redirect('/signup?signupError=이미 가입된 이메일입니다.');
        }
        else if (password !== re_password) {
            return res.redirect('/signup/?signupError=비밀번호가 맞지 않습니다.');
        }
        sanitize(password);
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            name,
            phone,
            nick,
            email,
            password: hash,
            answer,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    console.log("들어옴@@");
    passport.authenticate('local', (authError, user, info) => {
        console.log("passport들어옴@@");
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        console.log("통과@@");
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;