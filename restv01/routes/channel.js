const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let conn;
    try {

        var badRequestMsg = "";

        if (!req.body.chid) badRequestMsg = badRequestMsg.concat('\nChannel id');
        if (!req.body.name) badRequestMsg = badRequestMsg.concat('\nChannel name');
        if (!req.body.logo) badRequestMsg = badRequestMsg.concat('\nChannel logo');
        if (!req.body.cid) badRequestMsg = badRequestMsg.concat('\nChannel category id');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            res.status(400).json(badRequest);
        }        

        var chId = req.body.chid;
        var name = req.body.name;
        var logo = req.body.logo;
        var cid = req.body.cid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tblChannel(chid,name,logo,cid,active) 
        SELECT ${chId},'${name}','${logo}',tblCategory.cid,True FROM tblCategory 
        WHERE cid = ${cid} and active=True`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        var result = utility.Result(query, dbRes, `Channel ${name} created`);
        res.status(201).json(result);

    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.get('/', async (req, res, next) => {
    let conn;
    try {

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT chid, name, logo, cid FROM tblChannel WHERE active=True`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channels not found`);
            res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }     
});

router.get('/category/:cid', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.cid) {
            var badRequest = utility.BadRequestResult('Category id is not valid');
            res.status(400).json(badRequest);
        }

        var cid = req.params.cid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT chid, name, logo FROM tblChannel WHERE active=True and cid=${cid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channels not found for category ${cid}`);
            res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.get('/:chid/number', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.chid) {
            var badRequest = utility.BadRequestResult('Channel id is not valid');
            res.status(400).json(badRequest);
        }

        var chid = req.params.chid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT name, logo, cid FROM tblChannel WHERE active=True and chid=${chid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel ${chid} not found`);
            res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

router.get('/:name/name', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.name) {
            var badRequest = utility.BadRequestResult('Channel name is not valid');
            res.status(400).json(badRequest);
        }

        var name = req.params.name;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT chid, name, logo, cid FROM tblChannel WHERE active=True and name LIKE '%${name}%'`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel ${name} not found`);
            res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

router.put('/:chid', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.chid) {
            var badRequest = utility.BadRequestResult('Channel id is not valid');
            res.status(400).json(badRequest);
        }

        var badRequestMsg = "";
        
        if (!req.body.name) badRequestMsg = badRequestMsg.concat('\nChannel name');
        if (!req.body.logo) badRequestMsg = badRequestMsg.concat('\nChannel logo');
        if (!req.body.cid) badRequestMsg = badRequestMsg.concat('\nChannel category id');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            res.status(400).json(badRequest);
        }

        var chid = req.params.chid;
        var cname = req.body.name;
        var clogo = req.body.logo;
        var cid = req.body.cid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `UPDATE tblCategory as category, tblChannel as channel
        SET channel.name = '${cname}', channel.logo = '${clogo}', channel.cid = ${cid} 
        WHERE channel.active = True and category.active = True and category.cid = ${cid} and chid = ${chid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Channel updated successfully`);
            res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel or channel category not found`);
            res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.delete('/:chid', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.chid) {
            var badRequest = utility.BadRequestResult('Channel id is not valid');
            res.status(400).json(badRequest);
        }

        var chid = req.params.chid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `UPDATE tblChannel SET active = False WHERE active = True and chid = ${chid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Channel disabled successfully`);
            res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel not found`);
            res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    } 
});


module.exports = router;