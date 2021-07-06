const Mysqli = require('mysqli');

let conn = new Mysqli({
    host: 'localhost',
    post: 3306,
    user: 'zein_shop',
    passwd: '123456',
    db: 'shop'
});

let db = conn.emit(false,'');
module.exports = {
  database: db
};