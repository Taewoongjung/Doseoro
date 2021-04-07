const express = require('express');
const multer = require('multer');
const path = require('path');

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
        const { this_item_id, this_item_createdAt, this_item_OwnerId } = req.query;
        await Book.destroy({ where: { id: this_item_id, createdAt: this_item_createdAt, OwnerId: this_item_OwnerId }, });
        await Who.destroy({ where: { thisbook: this_item_id } });
        res.send(`<script type="text/javascript">alert("게시물 삭제 완료!"); location.href="/pages/selling";</script>`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0407 판매내역 창에 수정을 누르면 나오는 수정하는 창을 띄어주는 라우터
router.post('/editIt', isLoggedIn, async (req, res, next) => {
    try {
        const { this_item_id } = req.body;
        const books = await Book.findOne({ where: { id: this_item_id } });
        res.render('edit_saleDetail.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

const upload = multer({  // multer 설정
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 파일 덮어씌어지는거 방지
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// // 0407 수정내용을 저장하는 라우터
router.post('/edit', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { this_item_id, postmessage, title, price, author, publisher, checkCategory, checkState, dealRoot, about } = req.body;
        const [book] = await Promise.all([
            Book.update({
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
            }, {
                where: { id: this_item_id }
            }),
        ], [
            Who.update({
                thisbook: this_item_id,
                posttitle: postmessage,
                title: title,
                img: req.file.filename,
                price: price,
            }, {
                where: { liked: req.user.id }
            }),
        ]);
        console.log("2@@@@@",book);
        res.send(`<script type="text/javascript">alert("책 정보 수정 완료"); location.href="/book/${this_item_id}";</script>`); // 등록 하고 자기가 등록한 책 화면 띄우게 하기
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;