const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { Book, Who, Post, Community } = require('../models');
const { isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 카테고리 검색
router.get('/it', async (req, res, next) => {
    try {
        console.log("search/it 진입");

        if (req.query.searchFilter === 'postTitle') { // 게시물명 으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        postmessage: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);

            //////////// 알림 ////////////
            if (res.locals.user) {
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            } else if (isNotLoggedIn) {
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                });
            }
        } else if (req.query.searchFilter === 'bookTitle') {  // 책 이름으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        title: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);

            //////////// 알림 ////////////
            if (res.locals.user) {
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            } else if (isNotLoggedIn) {
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                });
            }
        } else if (req.query.searchFilter === 'bookAuther') {  // 책 저자명 으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        author: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);

            //////////// 알림 ////////////
            if (res.locals.user) {
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            } else if (isNotLoggedIn) {
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                });
            }
        } else if (req.query.searchFilter === 'bookPublisher') {  // 출판사명 으로 찾기
            const [foundBooks] = await Promise.all([
                Book.findAll({
                    where: {
                        publisher: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);

            //////////// 알림 ////////////
            if (res.locals.user) {
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            } else if (isNotLoggedIn) {
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                });
            }
        } else if (req.query.searchFilter === 'community') {  // 커뮤니티 제목으로 찾기
            const [foundCommus] = await Promise.all([
                Community.findAll({
                    where: {
                        title: {
                            [Op.like]: "%" + req.query.searchWord + "%"
                        },
                    },
                }),
            ]);

            //////////// 알림 ////////////
            if (res.locals.user) {
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

                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            } else if (isNotLoggedIn) {
                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                });
            }
        } 
            else if (req.query.searchFilter === 'All') {  // 전체
                console.log("all");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                        },
                    }),
                ]);
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            [Op.or]: [
                                {
                                    postmessage: {
                                        [Op.like]: "%" + req.query.searchWord + "%"
                                    },
                                }, {
                                    publisher: {
                                        [Op.like]: "%" + req.query.searchWord + "%"
                                    },
                                }, {
                                    author: {
                                        [Op.like]: "%" + req.query.searchWord + "%"
                                    },
                                }, {
                                    title: {
                                        [Op.like]: "%" + req.query.searchWord + "%"
                                    },
                                }]
                        },
                    }),
                ]);

                //////////// 알림 ////////////
                if (res.locals.user) {
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
                    
                    res.render('searchList.html', {
                        foundBooks,
                        foundCommus,
                        user: res.locals.user,
                        bookId: req.params.id,
                        noticess,
                        likesfornotice,
                    });
                } else if (isNotLoggedIn) {
                    res.render('searchList.html', {
                        foundBooks,
                        foundCommus,
                        user: res.locals.user,
                        bookId: req.params.id,
                });
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;