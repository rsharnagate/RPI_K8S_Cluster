var pool = require('../db/dbMySql')
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    var cName = req.body.name;
    pool.query(`INSERT INTO tblCategory VALUES (0, '${cName}', True)`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }
        res.status(201).send(`Channel category ${cName} created`);               
    });    
});

router.get('/', (req, res) => {
    pool.query(`SELECT cid, name FROM tblCategory WHERE active = True`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Channel category not found`);
        }        
    });    
});

router.get('/:cid', (req, res) => {
    var cid = req.params.cid;
    pool.query(`SELECT cid, name FROM tblCategory WHERE cid = ${cid} and active = True`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Channel category not found`);
        }        
    });    
});

router.put('/:cid', (req, res) => {
    var cid = req.params.cid;
    var cname = req.body.name;
    pool.query(`UPDATE tblCategory SET name = '${cname}' WHERE active = True and cid = ${cid}`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send(`Channel category does not exists`);
        }        
    });    
});

router.delete('/:cid', (req, res) => {
    var cid = req.params.cid;
    pool.query(`UPDATE tblCategory SET active = False WHERE active = True and cid = ${cid}`, (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send(`Channel category does not exists`);
        }        
    });    
});

module.exports = router;