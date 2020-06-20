var pool = require('../db/dbMySql')
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    var cid = req.body.cid;
    var ckey = req.body.key;

    pool.query(`INSERT INTO tblCommand VALUES (0, '${cid}', '${ckey}', True)`, 
    (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }
        
        res.status(201).send(`Command ${cid} created`);               
    });    
});

router.get('/', (req, res) => {
    pool.query('SELECT id, cid, `key` FROM tblCommand WHERE active = True', 
    (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Commands not found`);
        }        
    });    
});

router.get('/:cid/cid', (req, res) => {
    var cid = req.params.cid;
    pool.query("SELECT id, `key` FROM tblCommand WHERE cid = '" + cid + "' and active = True", 
    (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Command not found`);
        }        
    });    
});

router.get('/:key/key', (req, res) => {
    var ckey = req.params.key;
    pool.query("SELECT id, cid FROM tblCommand WHERE `key` = '" + ckey + "' and active = True", 
    (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Command not found`);
        }        
    });    
});

router.put('/:id', (req, res) => {
    var id = req.params.id;
    var cid = req.body.cid;
    var ckey = req.body.key;

    var sql = "UPDATE tblCommand SET cid = '" + cid + "', `key` = '" + ckey + "' WHERE active = True and id = " + id;

    pool.query(sql, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send(`Command not found`);
        }        
    });    
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    pool.query(`UPDATE tblCommand SET active = False WHERE active = True and id = '${id}'`, 
    (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send(`Command not found`);
        }        
    });    
});

module.exports = router;