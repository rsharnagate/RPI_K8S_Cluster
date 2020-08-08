const mysql = require('./db/dbMySql');
var cache = require('./cache');

module.exports = {

    Result : (req, dbRes, msg) => {
        return {
            "req": req,
            "dbRes": dbRes,
            "msg": msg
        };
    },
    
    OkResult : (req, dbRes) => {
        return {
            "req": req,
            "dbRes": dbRes,
            "msg": null
        };
    },
    
    BadRequestResult : (msg) => {
        return {        
            "req": null,
            "dbRes": null,
            "msg": msg
        };
    },

    GetTopic : async (devId) => {

        var cKey = 'GetTopic-' + devId;
    
        // check device topic cache
        var topic = cache.read(cKey);
        if (topic != null) {
            console.log('Reading device-topic mapping from cache');
            return topic;
        }

        console.log('Reading device-topic mapping from db');

        let conn;

        try {

            // establish connection with MariaDB
            conn = await mysql.getConnection();
    
            // Create new query
            var query = `SELECT topic FROM tbldevicetopic WHERE dev_id = '${devId}'`;
    
            // Execute the query
            var dbRes = await conn.query(query);
    
            // Respond to the user
            if (dbRes.length > 0) {            
                var topic = dbRes[0].topic;
                cache.store(cKey, topic);
                return topic;
            } else {
                return null;            
            }
        } catch (err) {
            console.error(err);
            return null;
        }        
    }
}   