테이블 이름| 열 이름| 데이터 형식| NULL 유무| 기본 키| 외래키| FK 테이블 이름| FK 열이름
---|---|---|---|---|---|---|---|
books| id| INT| NN| PK| -| -| -
"| postmessage| VAR(150)| -| -| -| -| -
"| price| INT| NN| -| -| -| -
"| title| VAR(100)| -| -| -| -| -
"| author| VAR(100)| -| -| -| -| -
"| category| JSON| -| -| -| -| -
"| state| JSON| -| -| -| -| -
"| tradingmethod| VAR(15)| -| -| -| -| -
"| img| JSON| -| -| -| -| -
"| likecount| INT| -| -| -| -| -
"| sold| TINY(1)| -| -| -| -| -
"| about| VAR(1000)| -| -| -| -| -
"| usernick| VAR(100)| -| -| -| -| -
"| isSelling| TINY(1)| -| -| -| -| -
"| hits| INT| -| -| -| -| -
"| cratedAt| DATETIME| NN| -| -| -| -
"| updatedAt| DATETIME| NN| -| -| -| -
"| deletedAt| DATETIME| -| -| -| -
"| OwnerId| INT| -| -| FK| users| -
"| SoldId| INT| -| -| -| -| -
