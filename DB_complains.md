테이블 이름| 열 이름| 데이터 형식| NULL 유무| 기본 키| 외래키| FK 테이블 이름| FK 열이름
---|---|---|---|---|---|---|---|
complains| id| INT| NN| PK| -| -| -
"| title| VAR(140)| -| -| -| -| -
"| content| VAR(1000)| -| -| -| -| -
"| complainedId| VAR(100)| -| -| FK| users| -
"| complainedNick| VAR(100)| -| -| FK| users| -
"| issettled| TINY(1)| -| -| -| -| -
"| hits| INT| -| -| -| -| -
"| cratedAt| DATETIME| NN| -| -| -| -
"| updatedAt| DATETIME| NN| -| -| -| -
"| deletedAt| DATETIME| -| -| -| -| -
