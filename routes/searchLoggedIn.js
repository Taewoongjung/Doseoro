const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require("sequelize");
const moment = require('moment-timezone');
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 카테고리 검색
router.get('/it', async (req, res, next) => {
    try {
        if (req.query.searchFilter === 'postTitle') { // 게시물명 으로 찾기   
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

            console.log("range = ", req.query);
            console.log("req.query.localRange = ", req.query.localRange);
            console.log("dong = ", res.locals.user);

            if (req.query.localRange === "0") { // 동 / 리
                console.log("a1a1a1aa");
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong:{
                                [Op.like]: "%" + res.locals.user.dong+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }
                
                console.log("a111aa");
                console.log("livein = ", livein );
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                console.log("foundBooks", foundBooks);
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si:{
                                [Op.like]: "%" + res.locals.user.si+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do:{
                                [Op.like]: "%" + res.locals.user.do+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location:{
                                [Op.like]: "%" + res.locals.user.location+ "%"
                            }
                        }
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            }
        } else if (req.query.searchFilter === 'bookTitle') {  // 책 이름으로 찾기
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
            /////////////
            
            console.log("range = ", req.query);
            console.log("req.query.localRange = ", req.query.localRange);
            console.log("dong = ", res.locals.user);

            if (req.query.localRange === "0") { // 동
                console.log("a1a1a1aa");
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong:{
                                [Op.like]: "%" + res.locals.user.dong+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si:{
                                [Op.like]: "%" + res.locals.user.si+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do:{
                                [Op.like]: "%" + res.locals.user.do+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location:{
                                [Op.like]: "%" + res.locals.user.location+ "%"
                            }
                        }
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            }

        } else if (req.query.searchFilter === 'bookAuther') {  // 책 저자명 으로 찾기
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

            console.log("range = ", req.query);
            console.log("req.query.localRange = ", req.query.localRange);
            console.log("dong = ", res.locals.user);

            if (req.query.localRange === "0") { // 동 / 리
                console.log("a1a1a1aa");
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong:{
                                [Op.like]: "%" + res.locals.user.dong+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si:{
                                [Op.like]: "%" + res.locals.user.si+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do:{
                                [Op.like]: "%" + res.locals.user.do+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location:{
                                [Op.like]: "%" + res.locals.user.location+ "%"
                            }
                        }
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            }
        } else if (req.query.searchFilter === 'bookPublisher') {  // 출판사명 으로 찾기
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
            console.log("range = ", req.query);
            console.log("req.query.localRange = ", req.query.localRange);
            console.log("dong = ", res.locals.user);

            if (req.query.localRange === "0") { // 동
                console.log("a1a1a1aa");
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong:{
                                [Op.like]: "%" + res.locals.user.dong+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si:{
                                [Op.like]: "%" + res.locals.user.si+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do:{
                                [Op.like]: "%" + res.locals.user.do+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location:{
                                [Op.like]: "%" + res.locals.user.location+ "%"
                            }
                        }
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            }
        } else if (req.query.searchFilter === 'community') {  // 커뮤니티 제목으로 찾기
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
            res.render('searchList.html', {
                foundCommus,
                user: res.locals.user,
                bookId: req.params.id,
                noticess,
                likesfornotice,
            });

            console.log("range = ", req.query);
            console.log("req.query.localRange = ", req.query.localRange);
            console.log("dong = ", res.locals.user);

            if (req.query.localRange === "0") { // 동 / 리
                console.log("a1a1a1aa");
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong:{
                                [Op.like]: "%" + res.locals.user.dong+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si:{
                                [Op.like]: "%" + res.locals.user.si+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do:{
                                [Op.like]: "%" + res.locals.user.do+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location:{
                                [Op.like]: "%" + res.locals.user.location+ "%"
                            }
                        }
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            }
        } else if (req.query.searchFilter === 'All') {  // 전체
            console.log("@@ all");
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
            console.log("range = ", req.query);
            console.log("req.query.localRange = ", req.query.localRange);
            console.log("dong = ", res.locals.user);

            if (req.query.localRange === "0") { // 동 / 리
                console.log("a1a1a1aa");
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong:{
                                [Op.like]: "%" + res.locals.user.dong+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
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
                                }],
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si:{
                                [Op.like]: "%" + res.locals.user.si+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
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
                                }],
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do:{
                                [Op.like]: "%" + res.locals.user.do+ "%"
                            }
                        }
                    })
                ]);

                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
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
                                }],
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location:{
                                [Op.like]: "%" + res.locals.user.location+ "%"
                            }
                        }
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

                console.log("a111aa");
                const [foundCommus] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
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
                                }],
                            OwnerId: livein
                        },
                    }),
                ]);
                console.log("aaa");
                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
                console.log("aaaaa");
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;