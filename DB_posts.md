테이블 이름| 열 이름| 데이터 형식| NULL 유무| 기본 키| 외래키| FK 테이블 이름| FK 열이름
---|---|---|---|---|---|---|---|
posts| id| INT| NN| PK| -| -| -
"| content| VAR(140)| -| -| -| -| -
"| commentingNick| VAR(100)| NN| -| -| -| -
"| img| VAR(200)| -| -| -| -| -
"| reCommentingId| VAR(100)| -| -| -| -| -
"| reCommentedId| VAR(100)| -| -| -| -| -
"| reCommentNick| VAR(100)| -| -| -| -| -
"| isNotified_posts| TINY(1)| -| -| -| -| -
"| thisURL| VAR(500)| -| -| -| -| -
"| createdAt| DATETIME| -| -| -| -| -
"| updatedAt| DATETIME)| -| -| -| -| -
"| deletedAt| DATETIME| -| -| -| -| -
"| UserId| INT| -| -| FK| users| -
"| BookId| INT| -| -| FK| books| -
"| CommentingId| INT| -| -| -| -| -
"| CommenterId| INT| -| -| -| -| -
"| PosterId| INT| NN| -| -| -| -
"| ComplainId| INT| -| -| FK| complains| -
"| CommunityId| INT| -| -| FK| communities| -
