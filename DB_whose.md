테이블 이름| 열 이름| 데이터 형식| NULL 유무| 기본 키| 외래키| FK 테이블 이름| FK 열이름
---|---|---|---|---|---|---|---|
whose| id| INT| NN| PK| -| -| -
"| thisbook| VAR(100)| -| -| -| -| -
"| likedNick| VAR(100)| -| -| FK| users| -
"| postitle| VAR(100)| -| -| -| -| -
"| title| VAR(100)| -| -| -| -| -
"| img| JSON| -| -| -| -| -
"| liked| VAR(100)| -| -| -| -| -
"| price| INT| -| -| -| -| -
"| thisURL| VAR(500)| -| -| -| -| -
"| bought| VAR(100)| -| -| -| -| -
"| isNotified_like| TINY(1)| -| -| -| -| -
"| cratedAt| DATETIME| NN| -| -| -| -
"| updatedAt| DATETIME| NN| -| -| -| -
"| deletedAt| DATETIME| -| -| -| -| -
"| UserId| INT| -| -| FK| users| -
"| BookId| INT| -| -| FK| users| -
