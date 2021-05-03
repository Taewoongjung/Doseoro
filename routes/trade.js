const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

router.post('/commentTrade', isLoggedIn, async (req, res, next) => {
    const { bookId, UserId } = req.body;
    const theBook = await Book.findOne({
        where:{
            id: bookId,
        }
    });
    console.log("책 아이디 = ", bookId);
    console.log("책 유저 아이디 = ", UserId);

    if (req.user.id === theBook.OwnerId) {
        console.log("통과");
        await Book.update({  // 거래 완료. 거래 완료 되면 화면에 뿌려주는 아이템들의 조건들이 다 바뀔 예정
            sold: 1,
            SoldId: UserId,
        }, {
            where: { id: theBook.id},
        });                             // 거래 완료되면 판매내역으로 이동할지 조원들과 회의
        return res.send(`<script type="text/javascript">alert("거래 완료!"); location.href="/book/${bookId}";</script>`);
    } else {
        return res.send(`<script type="text/javascript">alert("판매자가 아닙니다."); location.href="/book/${bookId}";</script>`);
    }

});

module.exports = router;