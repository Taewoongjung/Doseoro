const express = require('express');
const moment = require('moment-timezone');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { Book, Who, Post, Community, Complain } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 판매 책 등록
router.get('/registerBook', isLoggedIn, async (req, res) => {
    console.log("pages/registerBook 진입");

    //////////// 알림 ////////////
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
    //////////// 알림 ////////////

    res.render('registerBook.html', {
        noticess,
        likesfornotice,
    });
})

// 아이디 찾기
router.get('/findID', isNotLoggedIn, (req, res) => {
    console.log("pages/findID 진입");
    res.render('findID.html');
});

// 비밀번호 찾기
router.get('/findPW', isNotLoggedIn, (req, res) => {
    console.log("pages/findPW 진입");
    res.render('findPW.html');
});

// 비밀번호 변경
router.get('/changePW', isNotLoggedIn, (req, res) => {
    console.log("pages/changePW 진입");
    res.render('changePW.html');
})

// 검색 결과
router.get('/searchList', async (req, res) => {
    console.log("pages/searchList 진입");
    res.render('searchList.html')
})

// 고객문의
router.get('/csList', isLoggedIn, async (req, res) => {
    console.log("pages/csList 진입");

    //////////// 알림 ////////////
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
    //////////// 알림 ////////////

    // 고객문의 페이징
    let pageNum = req.query.page; // 전체 게시물 수
    let offset = 0;
    if (pageNum > 1) {  // 보여줄 게시물 수
        offset = 4 * (pageNum - 1);
    }

    const [complains] = await Promise.all([
        Complain.findAll({
            where: {
                isSettled: { [Op.ne]: 1 },
            },
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: 4,
        }),
    ]);

    const [AllComplains] = await Promise.all([ // 전체 페이지
        Complain.findAll({
            where: {
                isSettled: { [Op.ne]: 1 },
            }
        })
    ]);

    console.log("-길이- = ", AllComplains.length);

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

    let pageArr = new Array();
    for (let i = 0; i < Math.ceil(AllComplains.length / 4); i++) {
        pageArr[i] = i;
    }
    console.log("pageArr = ", pageArr);
    const { page } = req.query;

    res.render('csList.html', {
        complains: Acomplain,
        noticess,
        likesfornotice,
        maxPage: pageArr,
        currentPage: page,
    });
})

// 0506 고객문의 등록
router.get('/csRegist', isLoggedIn, async (req, res, next) => {
    console.log("pages/csRegist 진입");

    //////////// 알림 ////////////
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
    //////////// 알림 ////////////

    res.render('csRegist.html', {
        noticess,
        likesfornotice,
    });
})

router.get('/saleBoard', async (req, res, next) => {
    try {
        console.log("pages/saleBoard 진입");

        // 팝니다 리스트 페이징
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
                order: [['createdAt', 'DESC']],
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
                }
            })
        ]);

        console.log("-길이- = ", AllPageBooks.length);

        //////////// 알림 ////////////
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
            //////////// 알림 ////////////

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
        console.log("pages/like 진입");
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

        //////////// 알림 ////////////
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
        //////////// 알림 ////////////

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
        console.log("pages/buying 진입");

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
        console.log("pages/selling 진입");

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
    console.log("pages/myProfile 진입");

    res.render('myProfile.html');
});

// 0409 삽니다 등록
router.get('/registRequest', isLoggedIn, async (req, res, next) => {
    console.log("pages/registRequest 진입");

    //////////// 알림 ////////////
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
    //////////// 알림 ////////////

    res.render('registRequest.html', {
        noticess,
        likesfornotice,
    });
});

// 0409 삽니다
router.get('/bookRequest', async (req, res, next) => {
    try {
        console.log("pages/bookRequest 진입");

        // 삽니다 리스트 페이징 준비
        console.log("page = ", req.query.page);
        let pageNum = req.query.page; // 전체 게시물 수
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 6 * (pageNum - 1);
        }

        const [books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: '1' },
                order: [['createdAt', 'DESC']],
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

        //////////// 알림 ////////////
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
            //////////// 알림 ////////////

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
        console.log("pages/bookRequest 진입");

        //////////// 알림 ////////////

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
        console.log("noticess = ", noticess);
        //////////// 알림 ////////////

        // 판매하기
        // 판매글 페이징 
        /////////////////
        console.log("pageSale = ", req.query.pageSale);
        let pageNumSale = req.query.pageSale; // 전체 게시물 수
        let offsetSale = 0;
        if (pageNumSale > 1) {  // 보여줄 게시물 수
            offsetSale = 4 * (pageNumSale - 1);
        }

        const [wantsell_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, sold: null, isSelling: null, price: { [Op.ne]: -1 } }, limit: 4, offset: offsetSale, }),
        ]);

        console.log("wantsell_books = ", wantsell_books);

        const [AllPageBooksSale] = await Promise.all([ // mypage 판매글 전체 페이지
            Book.findAll({
                where: {
                    OwnerId: req.user.id,
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
        // 구매글 페이징 
        /////////////////
        console.log("page = ", req.query.pageBuying);
        let pageNumBuying = req.query.pageBuying; // 전체 게시물 수
        let offsetBuying = 0;
        if (pageNumBuying > 1) {  // 보여줄 게시물 수
            offsetBuying = 4 * (pageNumBuying - 1);
        }

        const [wantbuy_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, sold: null, isSelling: '1' }, limit: 4, offset: offsetBuying, }),
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
                    OwnerId: req.user.id,
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
        // 무료나눔 페이징
        ///////////////////
        console.log("page = ", req.query.pageFree);
        let pageNumFree = req.query.pageFree; // 전체 게시물 수
        let offsetFree = 0;
        if (pageNumFree > 1) {  // 보여줄 게시물 수
            offsetFree = 4 * (pageNumFree - 1);
        }

        const [free_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, SoldId: null, isSelling: null, price: -1 }, limit: 4, offset: offsetFree }),
        ]);

        console.log("free_books = ", free_books);

        const [AllPageBooksFree] = await Promise.all([ // mypage 무료나눔 페이지
            Book.findAll({
                where: {
                    OwnerId: req.user.id,
                    SoldId: null,
                    isSelling: null,
                    price: -1,
                }
            })
        ]);

        console.log("-길이- = ", AllPageBooksFree.length);

        let pageArrFree = new Array();
        for (let i = 0; i < Math.ceil(AllPageBooksFree.length / 4); i++) {
            pageArrFree[i] = i;
        }
        console.log("pageArrFree = ", pageArrFree);
        const { pageFree } = req.query;

        // 커뮤니티
        // 커뮤니티 페이징 
        ///////////////////
        console.log("page = ", req.query.pageCommunity);
        let pageNumCommunity = req.query.pageCommunity; // 전체 게시물 수
        let offsetCommunity = 0;
        if (pageNumCommunity > 1) {  // 보여줄 게시물 수
            offsetCommunity = 4 * (pageNumCommunity - 1);
        }

        const [communities] = await Promise.all([
            Community.findAll({ where: { postingId: req.user.id, postingNick: req.user.nick }, limit: 4, offset: offsetCommunity }),
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

        console.log("communities = ", communities);

        const [AllPageBooksCommunity] = await Promise.all([ // mypage 커뮤니티 페이지
            Community.findAll({
                where: {
                    postingId: req.user.id,
                    postingNick: req.user.nick,
                }
            })
        ]);

        console.log("-길이- = ", AllPageBooksCommunity.length);

        let pageArrCommunity = new Array();
        for (let i = 0; i < Math.ceil(AllPageBooksCommunity.length / 4); i++) {
            pageArrCommunity[i] = i;
        }
        console.log("pageArrFree = ", pageArrCommunity);
        const { pageCommunity } = req.query;

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
            maxPageFree: pageArrFree, // 무료나눔 페이징
            currentPageFree: pageFree,
            maxPageCommunity: pageArrCommunity, // 커뮤니티 페이징
            currentPageCommunity: pageCommunity,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0414 무료나눔
router.get('/donationBoard', async (req, res, next) => {
    try {
        console.log("pages/donationBoard 진입");

        // 무료나눔 리스트 페이징
        let pageNum = req.query.page; // 전체 게시물 수
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 8 * (pageNum - 1);
        }

        const [free_books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: null, price: -1 },
                order: [['createdAt', 'DESC']],
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
                }
            })
        ]);

        console.log("-길이- = ", AllPageDonatedBooks.length);

        //////////// 알림 ////////////
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
            //////////// 알림 ////////////

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
    console.log("pages/registDonation 진입");

    //////////// 알림 ////////////
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
    //////////// 알림 ////////////

    res.render('registDonation.html', {
        noticess,
        likesfornotice,
    });
});

// 0414 커뮤니티
router.get('/community', async (req, res, next) => {
    try {
        console.log("pages/community 진입");

        // 커뮤니티 리스트 페이징
        console.log("page = ", req.query.page);
        let pageNum = req.query.page;
        let offset = 0;
        if (pageNum > 1) {  // 보여줄 게시물 수
            offset = 6 * (pageNum - 1);
        }
        const [communities] = await Promise.all([
            Community.findAll({
                order: [['createdAt', 'DESC']],
                offset: offset,
                limit: 6,
            })
        ]);
        console.log("community = ", communities);

        const [AllPagecommunities] = await Promise.all([ // 전체 페이지
            Community.findAll({})
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
        //////////// 알림 ////////////
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
            //////////// 알림 ////////////

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
    console.log("pages/registCommunity 진입");

    //////////// 알림 ////////////
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
    //////////// 알림 ////////////

    res.render('registCommunity.html', {
        noticess,
        likesfornotice,
    });
});

module.exports = router;