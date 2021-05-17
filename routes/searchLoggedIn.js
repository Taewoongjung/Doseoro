const express = require('express');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { User, Book, Who, Post, Community } = require('../models');

const router = express.Router();

router.use((req, res, next) => { // 모든 라우터에 회원정보 넣어주기
    res.locals.user = req.user;
    next();
});

// 카테고리 검색
router.get('/it', async (req, res, next) => {
    try {
        console.log("searchLoggedIn/it 진입");

        if (req.query.searchFilter === 'postTitle') { // 게시물명 으로 찾기

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

            if (req.query.localRange === "0") { // 동 / 리
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            }
        } else if (req.query.searchFilter === 'bookTitle') {  // 책 이름으로 찾기

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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            }
        } else if (req.query.searchFilter === 'bookAuther') {  // 책 저자명 으로 찾기

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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            }
        } else if (req.query.searchFilter === 'bookPublisher') {  // 출판사명 으로 찾기

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

            if (req.query.localRange === "0") { // 동
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            }
        } else if (req.query.searchFilter === 'community') {  // 커뮤니티 제목으로 찾기

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
            
            res.render('searchList.html', {
                foundCommus,
                user: res.locals.user,
                bookId: req.params.id,
                noticess,
                likesfornotice,
            });

            if (req.query.localRange === "0") { // 동 / 리
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

                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            }
        } else if (req.query.searchFilter === 'All') {  // 전체

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

                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
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

                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            } else { // 모든 지역
                console.log('res.locals.user.location', res.locals.user.location);
                const [people] = await Promise.all([
                    User.findAll({
                    })
                ]);
                const livein = [];
                for (const peopleLivingIn of people) {
                    const { id } = peopleLivingIn;
                    livein.push(id);
                }

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

                res.render('searchList.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                });
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;