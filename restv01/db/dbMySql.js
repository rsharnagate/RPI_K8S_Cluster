var mysql = require('mysql2');
const config = require('/sl/rest/config/config.json');

var pool = mysql.createPool({
    host: config.MYSQL_HOST || "172.17.0.2",
    user: config.MYSQL_USER || "root",
    database: config.MYSQL_DB || "dbSL",
    password: config.MYSQL_PSWD || "123456",
    connectionLimit: config.MYSQL_POOL_LIMIT || 10,
    waitForConnections: true,    
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (conn) conn.release();

    return;
});

module.exports = pool;