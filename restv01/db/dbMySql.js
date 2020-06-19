var mysql = require('mysql2');
var config = require('./config.json');

var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
    waitForConnections: true,
    connectionLimit: 10,
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