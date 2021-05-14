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

    res.render('csList.html',{
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
    res.render('csRegist.html',{
        noticess,
        likesfornotice,
    });
})

router.get('/saleBoard', async (req, res, next) => {
    try {
        const [books] = await Promise.all([
            Book.findAll({
                where: {
                    SoldId: null,
                    isSelling: null,
                    price: {
                        [Op.ne]: -1
                    }
                }
            }),
        ]);
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
            res.render('saleBoard.html', {
                books,
                noticess,
                likesfornotice,
            });
        } else {
            res.render('saleBoard.html', {
                books,
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
        const [books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: '1' }
            })
        ]);

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
            res.render('bookRequest.html', {
                books:responseBooks,
                noticess,
                likesfornotice,
            });
        } else {
            res.render('bookRequest.html', {
                books:responseBooks,
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
        const [wantsell_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, sold:null, isSelling: null, price: { [Op.ne]: -1 } } }),
        ]);
        const [wantbuy_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, sold:null, isSelling: '1' } }),
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
        const [free_books] = await Promise.all([
            Book.findAll({ where: { OwnerId: req.user.id, SoldId: null, isSelling: null, price: -1 } }),
        ]);
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
        res.render('myPostingList.html', {
            wantsell_books,
            wantbuy_books: responseWantbuy,
            free_books,
            communities: responseCommunities,
            noticess,
            likesfornotice,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 0414 무료나눔
router.get('/donationBoard', async (req, res, next) => {
    try {
        const [free_books] = await Promise.all([
            Book.findAll({
                where: { SoldId: null, isSelling: null, price: -1 },
            })
        ]);
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
            res.render('donationBoard.html', {
                free_books,
                noticess,
                likesfornotice,
            });
        } else {
            res.render('donationBoard.html', {
                free_books,
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
        if(pageNum > 1){
            offset = 3 * (pageNum - 1);
        }

        const [communities] = await Promise.all([
            Community.findAll({
                order: [['createdAt', 'ASC']],
                offset: offset,
                limit: 3,
            })
        ]);
        console.log("community = ", communities);

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
            res.render('community.html', {
                communities: responseCommunities,
                noticess,
                likesfornotice,
            });
        } else {
            res.render('community.html', {
                communities: responseCommunities,
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