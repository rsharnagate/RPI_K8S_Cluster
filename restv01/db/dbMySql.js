var mysql = require('mariadb');
const config = require('/sl/rest/config/config.json');

const pool = mysql.createPool({
    host: config.MYSQL_HOST || "172.17.0.2",
    user: config.MYSQL_USER || "root",
    database: config.MYSQL_DB || "dbSL",
    password: config.MYSQL_PSWD || "123456",
    connectionLimit: config.MYSQL_POOL_LIMIT || 10
});

module.exports={
    getConnection: function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                resolve(connection);
            }).catch(function(error) {
                reject(error);
            });
        });
    }
}
