var pool = require('../db/dbMySql')
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    var chId = req.body.chid;
    var name = req.body.name;
    var logo = req.body.logo;
    var cid = req.body.cid;

    var sql = `INSERT INTO tblChannel(chid,name,logo,cid,active) 
    SELECT ${chId},'${name}','${logo}',tblCategory.cid,True FROM tblCategory 
    WHERE cid = ${cid} and active=True`;

    pool.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if(results.affectedRows <= 0) {
            res.status(404).send(`Channel category ${cid} not found`);
        } else {
            res.status(201).send(`Channel ${cid} created`);               
        }        
    });    
});

router.get('/', (req, res) => {
    pool.query(`SELECT chid, name, logo, cid FROM tblChannel WHERE active=True`, 
    (err, results) => {
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

router.get('/category/:cid', (req, res) => {
    var cid = req.params.cid;

    pool.query(`SELECT chid, name, logo FROM tblChannel WHERE active=True and cid=${cid}`, 
    (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Channel category ${cid} not found`);
        }        
    });    
});

router.get('/:chid/number', (req, res) => {
    var chid = req.params.chid;

    pool.query(`SELECT name, logo, cid FROM tblChannel WHERE active=True and chid=${chid}`, 
    (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Channel ${chid} not found`);
        }        
    });    
});

router.get('/:name/name', (req, res) => {
    var name = req.params.name;

    pool.query(`SELECT chid, name, logo, cid FROM tblChannel WHERE active=True and name LIKE '%${name}%'`, 
    (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.length > 0) {
            res.status(200).send(results);
        } else {
            res.status(404).send(`Channel ${name} not found`);
        }        
    });    
});

router.put('/:chid', (req, res) => {
    var chid = req.params.chid;
    var cname = req.body.name;
    var clogo = req.body.logo;
    var cid = req.body.cid;

    var sql = `UPDATE tblCategory as category, tblChannel as channel
    SET channel.name = '${cname}', channel.logo = '${clogo}', channel.cid = ${cid} 
    WHERE channel.active = True and category.active = True and category.cid = ${cid} and chid = ${chid}`;

    pool.query(sql, (err, results, fields) => {
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

router.delete('/:chid', (req, res) => {
    var chid = req.params.chid;
    pool.query(`UPDATE tblChannel SET active = False WHERE active = True and chid = ${chid}`, 
    (err, results, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send("API failed to process request");
        }

        if (results.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send(`Channel does not exists`);
        }        
    });    
});


module.exports = router;