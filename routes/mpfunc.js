const express = require('express');

const { User, Book, Who, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 0407 판매내역 삭제
router.get('/delete', isLoggedIn, async (req, res, next) => {
    try {
        console.log("@@@!@!@!@!");
        const { delete_this_item} = req.query;
        console.log("@!@!!@", delete_this_item);
        await Book.destroy({
            where: { id: delete_this_item } 
        });
        res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/selling";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;