require('dotenv').config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_SECRET,
    "database": "Teamproject",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": '+00:00',
    'pool': {
      max: 20,   // 최대 유지 connection 수
      min: 5,    // 최소 유지 connection 수
      idle: 60000 // connection을 몇ms까지 대기시킬 것인가 (이후엔 버려짐)
    }
  },
  "test": {
    "username": "root",
    "password": process.env.DB_SECRET,
    "database": "Teamproject",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": '+00:00',
    'pool': {
      max: 20,  
      min: 5,  
      idle: 60000 
    }
  },
  "production": {
    "username": "root",
    "password": process.env.DB_SECRET,
    "database": "Teamproject",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": '+00:00',
    'pool': {
      max: 20, 
      min: 5,  
      idle: 60000 
    }
  }
}
