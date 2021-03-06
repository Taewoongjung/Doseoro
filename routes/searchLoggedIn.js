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
                            dong: {
                                [Op.like]: "%" + res.locals.user.dong + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);
    
                console.log("-책(동/리) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si: {
                                [Op.like]: "%" + res.locals.user.si + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(시) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do: {
                                [Op.like]: "%" + res.locals.user.do + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(도) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location: {
                                [Op.like]: "%" + res.locals.user.location + "%"
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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            postmessage: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(모든 지역) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
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
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong: {
                                [Op.like]: "%" + res.locals.user.dong + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(동) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si: {
                                [Op.like]: "%" + res.locals.user.si + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(시) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;


                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do: {
                                [Op.like]: "%" + res.locals.user.do + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(도) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location: {
                                [Op.like]: "%" + res.locals.user.location + "%"
                            }
                        }
                    })
                ]);
                
                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(모든 지역) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
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
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong: {
                                [Op.like]: "%" + res.locals.user.dong + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(동) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,

                });
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si: {
                                [Op.like]: "%" + res.locals.user.si + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(시) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do: {
                                [Op.like]: "%" + res.locals.user.do + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(도) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location: {
                                [Op.like]: "%" + res.locals.user.location + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            author: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(모든 지역) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
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
                            dong: {
                                [Op.like]: "%" + res.locals.user.dong + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(동) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si: {
                                [Op.like]: "%" + res.locals.user.si + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }
                
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

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                        limit: 5,
                        offset: offset,
                    })
                ]);

                console.log("-책(시) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do: {
                                [Op.like]: "%" + res.locals.user.do + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(도) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location: {
                                [Op.like]: "%" + res.locals.user.location + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([
                    Book.findAll({
                        where: {
                            publisher: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            OwnerId: livein
                        },
                    })
                ]);

                console.log("-책(모든 지역) 길이- = ", AllPageBooks.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageBooks.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
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

            if (req.query.localRange === "0") { // 동 / 리
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong: {
                                [Op.like]: "%" + res.locals.user.dong + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ]);

                console.log("-커뮤니티(동) 길이- = ", AllPageCommu.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si: {
                                [Op.like]: "%" + res.locals.user.si + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ]);

                console.log("-커뮤니티(시) 길이- = ", AllPageCommu.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do: {
                                [Op.like]: "%" + res.locals.user.do + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ]);

                console.log("-커뮤니티(도) 길이- = ", AllPageCommu.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else { // 모든 지역
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            location: {
                                [Op.like]: "%" + res.locals.user.location + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 5 * (pageNum - 1);
                }

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
                        limit: 5,
                        offset: offset,
                    }),
                ]);

                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ]);

                console.log("-커뮤니티(모든 지역) 길이- = ", AllPageCommu.length);
    
                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length) / 5); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
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
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            dong: {
                                [Op.like]: "%" + res.locals.user.dong + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 8 * (pageNum - 1);
                }

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
                        limit: 4,
                        offset: offset,
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
                        limit: 4,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([ // 전체 페이지
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
                    })
                ]);
    
                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ])
    
                console.log("-책 길이- = ", AllPageBooks.length);
                console.log("-커뮤니티 길이- = ", AllPageCommu.length);

                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length + AllPageCommu.length) / 8); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.localRange === "1") { // 시
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            si: {
                                [Op.like]: "%" + res.locals.user.si + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 8 * (pageNum - 1);
                }

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
                        limit: 4,
                        offset: offset,
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
                        limit: 4,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([ // 전체 페이지
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
                    })
                ]);
    
                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ])
    
                console.log("-책 길이- = ", AllPageBooks.length);
                console.log("-커뮤니티 길이- = ", AllPageCommu.length);

                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length + AllPageCommu.length) / 8); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else if (req.query.range === "2") { // 도
                const [people] = await Promise.all([
                    User.findAll({
                        where: {
                            do: {
                                [Op.like]: "%" + res.locals.user.do + "%"
                            }
                        }
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 8 * (pageNum - 1);
                }

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
                        limit: 4,
                        offset: offset,
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
                        limit: 4,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([ // 전체 페이지
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
                    })
                ]);
    
                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ])
    
                console.log("-책 길이- = ", AllPageBooks.length);
                console.log("-커뮤니티 길이- = ", AllPageCommu.length);

                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length + AllPageCommu.length) / 8); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            } else { // 모든 지역
                console.log('res.locals.user.location', res.locals.user.location);
                const [people] = await Promise.all([
                    User.findAll({
                    })
                ]);

                const searchFilter = req.query.searchFilter;
                const searchWord = req.query.searchWord;
                const localRange = req.query.localRange;

                // 전체 찾기 리스트 페이징
                let pageNum = req.query.page; // 전체 게시물 수
                let offset = 0;
                if (pageNum > 1) {  // 보여줄 게시물 수
                    offset = 8 * (pageNum - 1);
                }

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
                        limit: 4,
                        offset: offset,
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
                        limit: 4,
                        offset: offset,
                    }),
                ]);

                const [AllPageBooks] = await Promise.all([ // 전체 페이지
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
                    })
                ]);
    
                const [AllPageCommu] = await Promise.all([
                    Community.findAll({
                        where: {
                            title: {
                                [Op.like]: "%" + req.query.searchWord + "%"
                            },
                            postingId: livein
                        },
                    })
                ])
    
                console.log("-책 길이- = ", AllPageBooks.length);
                console.log("-커뮤니티 길이- = ", AllPageCommu.length);

                let pageArr = new Array();
                for (let i = 0; i < Math.ceil((AllPageCommu.length + AllPageCommu.length) / 8); i++) {
                    pageArr[i] = i;
                }
                console.log("pageArr = ", pageArr);
                const { page } = req.query;

                res.render('searchListLoggedIn.html', {
                    foundBooks,
                    foundCommus,
                    user: res.locals.user,
                    bookId: req.params.id,
                    noticess,
                    likesfornotice,
                    maxPage: pageArr,
                    currentPage: page,
                    searchFilter: searchFilter,
                    searchWord: searchWord,
                    localRange: localRange,
                });
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;