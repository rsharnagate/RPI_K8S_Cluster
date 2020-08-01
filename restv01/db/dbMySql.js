var mysql = require('mariadb');

var pool = null;

try {
    const config = require('/sl/rest/config/config.json');
    pool = mysql.createPool({
        host: config.MYSQL_HOST || "mysql.default.svc.cluster.local",
        user: config.MYSQL_USER || "root",
        database: config.MYSQL_DB || "dbSL",
        password: config.MYSQL_PSWD || "my-root-password",
        connectionLimit: config.MYSQL_POOL_LIMIT || 10
    });
} catch (err) {
    console.error("config.json not found. Loading default values.");
    pool = mysql.createPool({
        host: "localhost",
        user: "root",
        database: "dbSL",
        password: "my-root-password",
        connectionLimit: 10
    });
}

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
