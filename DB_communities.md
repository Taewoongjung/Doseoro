테이블 이름| 열 이름| 데이터 형식| NULL 유무| 기본 키| 외래키| FK 테이블 이름| FK 열이름
---|---|---|---|---|---|---|---|
communities| id| INT| NN| PK| -| -| -
"| title| VAR(140)| -| -| -| -| -
"| content| VAR(100)| -| -| -| -| -
"| postingId| VAR(100)| -| -| FK| users| -
"| postingNick| VAR(100)| -| -| FK| users| -
"| commentingNick| VAR(100)| -| -| -| -| -
"| category| VAR(70)| -| -| -| -| -
"| hits| INT| -| -| -| -| -
"| createdAt| DATETIME| -| -| -| -| -
"| updatedAt| DATETIME)| -| -| -| -| -
"| deletedAt| DATETIME| -| -| -| -| -
