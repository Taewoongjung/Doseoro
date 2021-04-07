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
        const { this_item } = req.query;
        await Book.destroy({ where: { id: this_item } });
        res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/selling";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0407 판매내역 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item } = req.body;
        const books = await Book.findOne({ where: { id: this_item } });
        res.render('edit_saleDetail.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// // 0407 수정내용을 저장하는 라우터
// router.get('/edit', isLoggedIn, async (req, res, next) => {
//     try {
//         console.log("@@@!@!@!@!");
//         const { this_item } = req.query;
//         const books = await Book.findOne({ where: { id: this_item } });
//         res.render('edit_saleDetail.html', {
//             books,
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

router.post('/edit', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { postmessage, title, price, author, publisher, checkCategory, checkState, dealRoot, about } = req.body;
        const book = await Book.create({
            OwnerId: req.user.id,
            postmessage: postmessage,
            title: title,
            author: author,
            publisher: publisher,
            img: req.file.filename,
            category: checkCategory,
            state: checkState,
            price: price,
            tradingmethod: dealRoot,
            about: about,
        });
        res.send(`<script type="text/javascript">alert("책 등록 완료"); location.href="/book/${book.id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;