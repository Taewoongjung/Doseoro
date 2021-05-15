const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community, Complain } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 판매 책 등록
router.get('/regi-book', isLoggedIn, async (req, res) => {
    console.log("@@! = ", req.user.id);
    const [books_for_notice] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: req.user.id,
            }
        })
    ]);

    const [books_for_notice_commu] = await Promise.all([
        Community.findAll({
            where: {
                postingId: req.user.id,
            }
        })
    ]);


    const notices = [];
    for (const notice of books_for_notice) {
        const { id } = notice;
        notices.push(id);
    }

    const [likesfornotice] = await Promise.all([
        Who.findAll({
            where: {
                thisbook: notices,
                isNotified_like: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);

    const notices_commu = [];
    for (const notice of books_for_notice_commu) {
        const { id } = notice;
        notices_commu.push(id);
    }

    console.log("WWW = ", notices);
    console.log("book = ", books_for_notice);
    console.log("user = ", req.user.id);
    const [noticess] = await Promise.all([
        Post.findAll({
            where: {
                [Op.or]: [
                    {
                        BookId: notices,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }, { // 커뮤니티 댓글 구별
                        CommunityId: notices_commu,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }],
                isNotified_posts: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);
    console.log("noticess = ", noticess);
    ////////////
    res.render('registerBook.html', {
        noticess,
        likesfornotice,
    });
})

router.get('/findID', isNotLoggedIn, (req, res) => {
    res.render('findID.html');
});

router.get('/findPW', isNotLoggedIn, (req, res) => {
    res.render('findPW.html');
});

router.get('/changePW', isNotLoggedIn, (req, res) => {
    res.render('changePW.html');
})

// 0510 검색 결과
router.get('/searchList', async (req, res) => {
    res.render('searchList.html')
})

// 0503 고객문의
router.get('/csList', isLoggedIn, async (req, res) => {
    const [complains] = await Promise.all([
        Complain.findAll({
            where: {
                isSettled: { [Op.ne]: 1 },
            }
        }),
    ]);

    const Acomplain = [];
    for (const complain of complains) {
        const { createdAt, complainedNick, isSettled, complainedId, id, content, title } = complain;
        Acomplain.push({
            createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
            title,
            content,
            complainedNick,
            complainedId,
            id,
            isSettled
        });
    }

    /////////////

    console.log("@@! = ", req.user.id);
    const [books_for_notice] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: req.user.id,
            }
        })
    ]);

    const [books_for_notice_commu] = await Promise.all([
        Community.findAll({
            where: {
                postingId: req.user.id,
            }
        })
    ]);


    const notices = [];
    for (const notice of books_for_notice) {
        const { id } = notice;
        notices.push(id);
    }

    const [likesfornotice] = await Promise.all([
        Who.findAll({
            where: {
                thisbook: notices,
                isNotified_like: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);

    const notices_commu = [];
    for (const notice of books_for_notice_commu) {
        const { id } = notice;
        notices_commu.push(id);
    }

    console.log("WWW = ", notices);
    console.log("book = ", books_for_notice);
    console.log("user = ", req.user.id);
    const [noticess] = await Promise.all([
        Post.findAll({
            where: {
                [Op.or]: [
                    {
                        BookId: notices,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }, { // 커뮤니티 댓글 구별
                        CommunityId: notices_commu,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }],
                isNotified_posts: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);
    console.log("noticess = ", noticess);

    ////////////

    res.render('csList.html', {
        complains: Acomplain,
        noticess,
        likesfornotice,
    });
})

// 0506 고객문의 등록
router.get('/csRegist', isLoggedIn, async (req, res, next) => {
    console.log("@@! = ", req.user.id);
    /////////////

    console.log("@@! = ", req.user.id);
    const [books_for_notice] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: req.user.id,
            }
        })
    ]);

    const [books_for_notice_commu] = await Promise.all([
        Community.findAll({
            where: {
                postingId: req.user.id,
            }
        })
    ]);


    const notices = [];
    for (const notice of books_for_notice) {
        const { id } = notice;
        notices.push(id);
    }

    const [likesfornotice] = await Promise.all([
        Who.findAll({
            where: {
                thisbook: notices,
                isNotified_like: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);

    const notices_commu = [];
    for (const notice of books_for_notice_commu) {
        const { id } = notice;
        notices_commu.push(id);
    }

    console.log("WWW = ", notices);
    console.log("book = ", books_for_notice);
    console.log("user = ", req.user.id);
    const [noticess] = await Promise.all([
        Post.findAll({
            where: {
                [Op.or]: [
                    {
                        BookId: notices,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }, { // 커뮤니티 댓글 구별
                        CommunityId: notices_commu,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }],
                isNotified_posts: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);
    console.log("noticess = ", noticess);

    ////////////
    res.render('csRegist.html', {
        noticess,
        likesfornotice,
    });
})

router.get('/saleBoard', async (req, res, next) => {
    try {
        // 페이징 준비
        console.log("page = ", req.query.page);
        let pageNum = req.query.page; // 전체 게시물 수
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 8 * (pageNum - 1);
        }

        const [books] = await Promise.all([
            Book.findAll({
                where: {
                    SoldId: null,
                    isSelling: null,
                    price: {
                        [Op.ne]: -1
                    },
                },
                order: [['createdAt', 'ASC']],
                limit: 8,
                offset: offset,
            }),
        ]);
        console.log("books = ", books);

        const [AllPageBooks] = await Promise.all([ // 전체 페이지
            Book.findAll({
                where: {
                    SoldId: null,
                    isSelling: null,
                    price: {
                        [Op.ne]: -1
                    }
                },
                order: [['createdAt', 'ASC']],
            })
        ]);

        console.log("-길이- = ", AllPageBooks.length);

        /////////////
        if (req.user) {
            console.log("@@! = ", req.user.id);
            const [books_for_notice] = await Promise.all([
                Book.findAll({
                    where: {
                        OwnerId: req.user.id,
                    }
                })
            ]);

            const [books_for_notice_commu] = await Promise.all([
                Community.findAll({
                    where: {
                        postingId: req.user.id,
                    }
                })
            ]);


            const notices = [];
            for (const notice of books_for_notice) {
                const { id } = notice;
                notices.push(id);
            }

            const [likesfornotice] = await Promise.all([
                Who.findAll({
                    where: {
                        thisbook: notices,
                        isNotified_like: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);

            const notices_commu = [];
            for (const notice of books_for_notice_commu) {
                const { id } = notice;
                notices_commu.push(id);
            }

            console.log("WWW = ", notices);
            console.log("book = ", books_for_notice);
            console.log("user = ", req.user.id);
            const [noticess] = await Promise.all([
                Post.findAll({
                    where: {
                        [Op.or]: [
                            {
                                BookId: notices,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }, { // 커뮤니티 댓글 구별
                                CommunityId: notices_commu,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }],
                        isNotified_posts: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);
            console.log("noticess = ", noticess);
            ////////////

            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPageBooks.length / 8); i++) {
                pageArr[i] = i;
            }
            console.log("pageArr = ", pageArr);
            const { page } = req.query;

            res.render('saleBoard.html', {
                books,
                noticess,
                likesfornotice,
                maxPage: pageArr,
                currentPage: page,
            });
        } else {

            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPageBooks.length / 8); i++) {
                pageArr[i] = i;
            }

            const { page } = req.query;

            res.render('saleBoard.html', {
                books,
                maxPage: pageArr,
                currentPage: page,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// 0403 관심상품 창
router.get('/like', isLoggedIn, async (req, res, next) => {
    try {
        console.log("user id = ", String(req.user.id));
        const [books] = await Promise.all([
            Who.findAll({
                where: {
                    liked: String(req.user.id),
                    price: {
                        [Op.ne]: -1
                    },
                },
            }),
        ]);
        const [free_books] = await Promise.all([
            Who.findAll({
                where: { liked: String(req.user.id), price: -1, },
            })
        ]);
        /////////////

        console.log("@@! = ", req.user.id);
        const [books_for_notice] = await Promise.all([
            Book.findAll({
                where: {
                    OwnerId: req.user.id,
                }
            })
        ]);

        const [books_for_notice_commu] = await Promise.all([
            Community.findAll({
                where: {
                    postingId: req.user.id,
                }
            })
        ]);


        const notices = [];
        for (const notice of books_for_notice) {
            const { id } = notice;
            notices.push(id);
        }

        const [likesfornotice] = await Promise.all([
            Who.findAll({
                where: {
                    thisbook: notices,
                    isNotified_like: {
                        [Op.ne]: '1'
                    },
                }
            })
        ]);

        const notices_commu = [];
        for (const notice of books_for_notice_commu) {
            const { id } = notice;
            notices_commu.push(id);
        }

        console.log("WWW = ", notices);
        console.log("book = ", books_for_notice);
        console.log("user = ", req.user.id);
        const [noticess] = await Promise.all([
            Post.findAll({
                where: {
                    [Op.or]: [
                        {
                            BookId: notices,
                            UserId: { [Op.ne]: String(req.user.id) }
                        }, { // 커뮤니티 댓글 구별
                            CommunityId: notices_commu,
                            UserId: { [Op.ne]: String(req.user.id) }
                        }],
                    isNotified_posts: {
                        [Op.ne]: '1'
                    },
                }
            })
        ]);
        console.log("noticess = ", noticess);

        ////////////
        res.render('likedProduct.html', {
            books,
            free_books,
            noticess,
            likesfornotice,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0410 구매내역 창
router.get('/buying', isLoggedIn, async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { OwnerId: req.user.id, isSelling: '1' } });
        res.render('buyingList.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0407 판매내역 창
router.get('/selling', isLoggedIn, async (req, res, next) => {
    try {
        const books = await Book.findAll({ where: { OwnerId: req.user.id, isSelling: null } });
        res.render('sellingList.html', {
            books,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0408 프로필
router.get('/myProfile', isNotLoggedIn, (req, res, next) => {
    res.render('myProfile.html');
});

// 0409 삽니다 등록
router.get('/registRequest', isLoggedIn, async (req, res, next) => {
    console.log("@@! = ", req.user.id);
    const [books_for_notice] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: req.user.id,
            }
        })
    ]);

    const [books_for_notice_commu] = await Promise.all([
        Community.findAll({
            where: {
                postingId: req.user.id,
            }
        })
    ]);


    const notices = [];
    for (const notice of books_for_notice) {
        const { id } = notice;
        notices.push(id);
    }

    const [likesfornotice] = await Promise.all([
        Who.findAll({
            where: {
                thisbook: notices,
                isNotified_like: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);

    const notices_commu = [];
    for (const notice of books_for_notice_commu) {
        const { id } = notice;
        notices_commu.push(id);
    }

    console.log("WWW = ", notices);
    console.log("book = ", books_for_notice);
    console.log("user = ", req.user.id);
    const [noticess] = await Promise.all([
        Post.findAll({
            where: {
                [Op.or]: [
                    {
                        BookId: notices,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }, { // 커뮤니티 댓글 구별
                        CommunityId: notices_commu,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }],
                isNotified_posts: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);
    console.log("noticess = ", noticess);
    ////////////
    res.render('registRequest.html', {
        noticess,
        likesfornotice,
    });
});

// 0409 삽니다
router.get('/bookRequest', async (req, res, next) => {
    try {
        // 페이징 준비
        console.log("page = ", req.query.page);
        let pageNum = req.query.page; // 전체 게시물 수
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 6 * (pageNum - 1);
        }

        const [books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: '1' },
                order: [['createdAt', 'ASC']],
                offset: offset,
                limit: 6,
            })
        ]);

        const [AllPageBuyingBooks] = await Promise.all([ // 전체 페이지
            Book.findAll({
                where: {
                    SoldId: null,
                    isSelling: '1',
                }
            })
        ]);

        console.log("-길이- = ", AllPageBuyingBooks.length);

        const responseBooks = [];
        for (const book of books) {
            const { createdAt, id, postmessage, usernick, title, about } = book;
            responseBooks.push({
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
                id,
                postmessage,
                usernick,
                title,
                about,
            });
        }

        /////////////
        if (req.user) {
            console.log("@@! = ", req.user.id);
            const [books_for_notice] = await Promise.all([
                Book.findAll({
                    where: {
                        OwnerId: req.user.id,
                    }
                })
            ]);

            const [books_for_notice_commu] = await Promise.all([
                Community.findAll({
                    where: {
                        postingId: req.user.id,
                    }
                })
            ]);


            const notices = [];
            for (const notice of books_for_notice) {
                const { id } = notice;
                notices.push(id);
            }

            const [likesfornotice] = await Promise.all([
                Who.findAll({
                    where: {
                        thisbook: notices,
                        isNotified_like: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);

            const notices_commu = [];
            for (const notice of books_for_notice_commu) {
                const { id } = notice;
                notices_commu.push(id);
            }

            console.log("WWW = ", notices);
            console.log("book = ", books_for_notice);
            console.log("user = ", req.user.id);
            const [noticess] = await Promise.all([
                Post.findAll({
                    where: {
                        [Op.or]: [
                            {
                                BookId: notices,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }, { // 커뮤니티 댓글 구별
                                CommunityId: notices_commu,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }],
                        isNotified_posts: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);
            console.log("noticess = ", noticess);
            ////////////

            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPageBuyingBooks.length / 6); i++) {
                pageArr[i] = i;
            }
            const { page } = req.query;

            res.render('bookRequest.html', {
                books: responseBooks,
                noticess,
                likesfornotice,
                maxPage: pageArr,
                currentPage: page,
            });
        } else {

            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPageBuyingBooks.length / 6); i++) {
                pageArr[i] = i;
            }
            const { page } = req.query;

            res.render('bookRequest.html', {
                books: responseBooks,
                maxPage: pageArr,
                currentPage: page,
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// 0414 작성한 글 목록
router.get('/myPostingList', isLoggedIn, async (req, res, next) => {
    try {
        /////////////

        console.log("@@! = ", req.user.id);
        const [books_for_notice] = await Promise.all([
            Book.findAll({
                where: {
                    OwnerId: req.user.id,
                }
            })
        ]);

        const [books_for_notice_commu] = await Promise.all([
            Community.findAll({
                where: {
                    postingId: req.user.id,
                }
            })
        ]);

        const notices = [];
        for (const notice of books_for_notice) {
            const { id } = notice;
            notices.push(id);
        }

        const [likesfornotice] = await Promise.all([
            Who.findAll({
                where: {
                    thisbook: notices,
                    isNotified_like: {
                        [Op.ne]: '1'
                    },
                }
            })
        ]);

        const notices_commu = [];
        for (const notice of books_for_notice_commu) {
            const { id } = notice;
            notices_commu.push(id);
        }

        console.log("WWW = ", notices);
        console.log("book = ", books_for_notice);
        console.log("user = ", req.user.id);
        const [noticess] = await Promise.all([
            Post.findAll({
                where: {
                    [Op.or]: [
                        {
                            BookId: notices,
                            UserId: { [Op.ne]: String(req.user.id) }
                        }, { // 커뮤니티 댓글 구별
                            CommunityId: notices_commu,
                            UserId: { [Op.ne]: String(req.user.id) }
                        }],
                    isNotified_posts: {
                        [Op.ne]: '1'
                    },
                }
            })
        ]);
        console.log("noticess = ", noticess);

        ////////////

        // 판매하기
        // 판매글 페이징 준비
        console.log("pageSale = ", req.query.pageSale);
        let pageNumSale = req.query.pageSale; // 전체 게시물 수
        let offsetSale = 0;
        if (pageNumSale > 1) {  // 보여줄 게시물 수
            offsetSale = 4 * (pageNumSale - 1);
        }

        const [wantsell_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, sold: null, isSelling: null, price: { [Op.ne]: -1 }}, limit: 4, offset: offsetSale, } ),
        ]);

        console.log("wantsell_books = ", wantsell_books);

        const [AllPageBooksSale] = await Promise.all([ // mypage 판매글 전체 페이지
            Book.findAll({
                where: {
                    sold: null,
                    isSelling: null,
                    price: {
                        [Op.ne]: -1
                    }
                }
            })
        ]);

        console.log("-길이- = ", AllPageBooksSale.length);

        let pageArrSale = new Array();
        for (let i = 0; i < Math.ceil(AllPageBooksSale.length / 4); i++) {
            pageArrSale[i] = i;
        }
        console.log("pageArrSale = ", pageArrSale);
        const { pageSale } = req.query;

        // 구매하기
        // 구매글 페이징 준비
        console.log("page = ", req.query.pageBuying);
        let pageNumBuying = req.query.pageBuying; // 전체 게시물 수
        let offsetBuying = 0;
        if (pageNumBuying > 1) {  // 보여줄 게시물 수
            offsetBuying = 4 * (pageNumBuying - 1);
        }

        const [wantbuy_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, sold: null, isSelling: '1' }, limit: 4, offset: offsetBuying,}),
        ]);
        const responseWantbuy = [];
        for (const buy of wantbuy_books) {
            const { createdAt, postmessage, id, OwnerId, about } = buy;
            responseWantbuy.push({
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
                OwnerId,
                postmessage,
                about,
                id,
            });
        }

        console.log("wantbuy_books = ", wantbuy_books);

        const [AllPageBooksBuying] = await Promise.all([ // mypage 구매글 페이지
            Book.findAll({
                where: {
                    sold: null,
                    isSelling: '1',
                }
            })
        ]);

        console.log("-길이- = ", AllPageBooksBuying.length);

        let pageArrBuying = new Array();
        for (let i = 0; i < Math.ceil(AllPageBooksBuying.length / 4); i++) {
            pageArrBuying[i] = i;
        }
        console.log("pageArrSale = ", pageArrBuying);
        const { pageBuying } = req.query;

        // 무료나눔
        // 무료나눔 페이징 준비
        console.log("page = ", req.query.page);
        let pageNum = req.query.page; // 전체 게시물 수
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 4 * (pageNum - 1);
        }

        const [free_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, SoldId: null, isSelling: null, price: -1 } }),
        ]);

        // 커뮤니티
        const [communities] = await Promise.all([
            Community.findAll({ where: { postingId: req.user.id, postingNick: req.user.nick } }),
        ]);
        const responseCommunities = [];
        for (const community of communities) {
            const { createdAt, title, id, OwnerId, content } = community;
            responseCommunities.push({
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
                title,
                OwnerId,
                content,
                id,
            });
        }

        res.render('myPostingList.html', {
            wantsell_books,
            wantbuy_books: responseWantbuy,
            free_books,
            communities: responseCommunities,
            noticess,
            likesfornotice,
            maxPageSale: pageArrSale, // 판매글 페이징
            currentPageSale: pageSale,
            maxPageBuying: pageArrBuying, // 구매글 페이징
            currentPageBuying: pageBuying,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0414 무료나눔
router.get('/donationBoard', async (req, res, next) => {
    try {
        // 페이징 준비
        console.log("page = ", req.query.page);
        let pageNum = req.query.page; // 전체 게시물 수
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 8 * (pageNum - 1);
        }

        const [free_books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: null, price: -1 },
                order: [['createdAt', 'ASC']],
                offset: offset,
                limit: 8,
            })
        ]);
        console.log("free_books = ", free_books);

        const [AllPageDonatedBooks] = await Promise.all([ // 전체 페이지
            Book.findAll({
                where: {
                    SoldId: null,
                    isSelling: null,
                    price: -1
                },
                order: [['createdAt', 'ASC']],
            })
        ]);

        console.log("-길이- = ", AllPageDonatedBooks.length);

        ////////////////

        if (req.user) {
            console.log("@@! = ", req.user.id);
            const [books_for_notice] = await Promise.all([
                Book.findAll({
                    where: {
                        OwnerId: req.user.id,
                    }
                })
            ]);

            const [books_for_notice_commu] = await Promise.all([
                Community.findAll({
                    where: {
                        postingId: req.user.id,
                    }
                })
            ]);


            const notices = [];
            for (const notice of books_for_notice) {
                const { id } = notice;
                notices.push(id);
            }

            const [likesfornotice] = await Promise.all([
                Who.findAll({
                    where: {
                        thisbook: notices,
                        isNotified_like: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);

            const notices_commu = [];
            for (const notice of books_for_notice_commu) {
                const { id } = notice;
                notices_commu.push(id);
            }

            console.log("WWW = ", notices);
            console.log("book = ", books_for_notice);
            console.log("user = ", req.user.id);
            const [noticess] = await Promise.all([
                Post.findAll({
                    where: {
                        [Op.or]: [
                            {
                                BookId: notices,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }, { // 커뮤니티 댓글 구별
                                CommunityId: notices_commu,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }],
                        isNotified_posts: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);
            console.log("noticess = ", noticess);
            ////////////

            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPageDonatedBooks.length / 8); i++) {
                pageArr[i] = i;
            }
            const { page } = req.query;

            res.render('donationBoard.html', {
                free_books,
                noticess,
                likesfornotice,
                maxPage: pageArr,
                currentPage: page
            });
        } else {

            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPageDonatedBooks.length / 8); i++) {
                pageArr[i] = i;
            }
            const { page } = req.query;

            res.render('donationBoard.html', {
                free_books,
                maxPage: pageArr,
                currentPage: page
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});


// 0414 나눔 등록
router.get('/registDonation', isLoggedIn, async (req, res) => {
    console.log("@@! = ", req.user.id);
    const [books_for_notice] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: req.user.id,
            }
        })
    ]);

    const [books_for_notice_commu] = await Promise.all([
        Community.findAll({
            where: {
                postingId: req.user.id,
            }
        })
    ]);


    const notices = [];
    for (const notice of books_for_notice) {
        const { id } = notice;
        notices.push(id);
    }

    const [likesfornotice] = await Promise.all([
        Who.findAll({
            where: {
                thisbook: notices,
                isNotified_like: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);

    const notices_commu = [];
    for (const notice of books_for_notice_commu) {
        const { id } = notice;
        notices_commu.push(id);
    }

    console.log("WWW = ", notices);
    console.log("book = ", books_for_notice);
    console.log("user = ", req.user.id);
    const [noticess] = await Promise.all([
        Post.findAll({
            where: {
                [Op.or]: [
                    {
                        BookId: notices,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }, { // 커뮤니티 댓글 구별
                        CommunityId: notices_commu,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }],
                isNotified_posts: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);
    console.log("noticess = ", noticess);
    ////////////
    res.render('registDonation.html', {
        noticess,
        likesfornotice,
    });
});

// 0414 커뮤니티
router.get('/community', async (req, res, next) => {
    try {
        // 페이징 준비
        console.log("page = ", req.query.page);
        let pageNum = req.query.page;
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 6 * (pageNum - 1);
        }
        const [communities] = await Promise.all([
            Community.findAll({
                order: [['createdAt', 'ASC']],
                offset: offset,
                limit: 6,
            })
        ]);
        console.log("community = ", communities);

        const [AllPagecommunities] = await Promise.all([ // 전체 페이지
            Community.findAll({
                order: [['createdAt', 'ASC']],
            })
        ]);

        console.log("-길이- = ", AllPagecommunities.length);

        const responseCommunities = [];
        for (const community of communities) {
            const { createdAt, content, id, title, postingNick, category } = community;
            responseCommunities.push({
                createdAt: moment(createdAt).format('YYYY.MM.DD HH:mm'),
                content,
                id,
                title,
                postingNick,
                category,
            });
        }
        if (req.user) {
            const [books_for_notice] = await Promise.all([
                Book.findAll({
                    where: {
                        OwnerId: req.user.id,
                    }
                })
            ]);

            const [books_for_notice_commu] = await Promise.all([
                Community.findAll({
                    where: {
                        postingId: req.user.id,
                    }
                })
            ]);

            const notices = [];
            for (const notice of books_for_notice) {
                const { id } = notice;
                notices.push(id);
            }

            const [likesfornotice] = await Promise.all([
                Who.findAll({
                    where: {
                        thisbook: notices,
                        isNotified_like: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);

            const notices_commu = [];
            for (const notice of books_for_notice_commu) {
                const { id } = notice;
                notices_commu.push(id);
            }

            const [noticess] = await Promise.all([
                Post.findAll({
                    where: {
                        [Op.or]: [
                            {
                                BookId: notices,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }, { // 커뮤니티 댓글 구별
                                CommunityId: notices_commu,
                                UserId: { [Op.ne]: String(req.user.id) }
                            }],
                        isNotified_posts: {
                            [Op.ne]: '1'
                        },
                    }
                })
            ]);
            ////////////
            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPagecommunities.length / 6); i++) {
                pageArr[i] = i;
            }
            const { page } = req.query;
            res.render('community.html', {
                communities: responseCommunities,
                AllPagecommunities,
                noticess,
                likesfornotice,
                maxPage: pageArr,
                currentPage: page
            });
        } else {
            let pageArr = new Array();
            for (let i = 0; i < Math.ceil(AllPagecommunities.length / 6); i++) {
                pageArr[i] = i;
            }
            const { page } = req.query;
            console.log("currentPage = ", page);
            res.render('community.html', {
                communities: responseCommunities,
                AllPagecommunities,
                maxPage: pageArr,
                currentPage: page
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0414 커뮤니티 등록
router.get('/registCommunity', isLoggedIn, async (req, res) => {
    console.log("@@! = ", req.user.id);
    const [books_for_notice] = await Promise.all([
        Book.findAll({
            where: {
                OwnerId: req.user.id,
            }
        })
    ]);

    const [books_for_notice_commu] = await Promise.all([
        Community.findAll({
            where: {
                postingId: req.user.id,
            }
        })
    ]);

    const notices = [];
    for (const notice of books_for_notice) {
        const { id } = notice;
        notices.push(id);
    }

    const [likesfornotice] = await Promise.all([
        Who.findAll({
            where: {
                thisbook: notices,
                isNotified_like: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);

    const notices_commu = [];
    for (const notice of books_for_notice_commu) {
        const { id } = notice;
        notices_commu.push(id);
    }

    console.log("WWW = ", notices);
    console.log("book = ", books_for_notice);
    console.log("user = ", req.user.id);
    const [noticess] = await Promise.all([
        Post.findAll({
            where: {
                [Op.or]: [
                    {
                        BookId: notices,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }, { // 커뮤니티 댓글 구별
                        CommunityId: notices_commu,
                        UserId: { [Op.ne]: String(req.user.id) }
                    }],
                isNotified_posts: {
                    [Op.ne]: '1'
                },
            }
        })
    ]);
    console.log("noticess = ", noticess);
    ////////////
    res.render('registCommunity.html', {
        noticess,
        likesfornotice,
    });
});

module.exports = router;