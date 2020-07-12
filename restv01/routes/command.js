const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let conn;
    try {

        var badRequestMsg = "";

        if (!req.body.cid) badRequestMsg = badRequestMsg.concat('\Command id');
        if (!req.body.key) badRequestMsg = badRequestMsg.concat('\nCommand key');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            res.status(400).json(badRequest);
        }        

        var cid = req.body.cid;
        var ckey = req.body.key;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tblCommand VALUES (0, '${cid}', '${ckey}', True)`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        var result = utility.Result(query, dbRes, `Command ${cid} created`);
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
        var query = 'SELECT id, cid, `key` FROM tblCommand WHERE active = True';

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Commands not found`);
            res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.get('/:cid/cid', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.cid) {
            var badRequest = utility.BadRequestResult('Command id is not valid');
            res.status(400).json(badRequest);
        }

        var cid = req.params.cid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = "SELECT id, `key` FROM tblCommand WHERE cid = '" + cid + "' and active = True";

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command not found`);
            res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

router.get('/:key/key', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.key) {
            var badRequest = utility.BadRequestResult('Command key is not valid');
            res.status(400).json(badRequest);
        }

        var ckey = req.params.key;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = "SELECT id, cid FROM tblCommand WHERE `key` = '" + ckey + "' and active = True";

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command not found`);
            res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

router.put('/:id', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.id) {
            var badRequest = utility.BadRequestResult('Command id is not valid');
            res.status(400).json(badRequest);
        }

        var badRequestMsg = "";
        
        if (!req.body.cid) badRequestMsg = badRequestMsg.concat('\Command id');
        if (!req.body.key) badRequestMsg = badRequestMsg.concat('\Command key');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            res.status(400).json(badRequest);
        }

        var id = req.params.id;
        var cid = req.body.cid;
        var ckey = req.body.key;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = "UPDATE tblCommand SET cid = '" + cid + "', `key` = '" + ckey + "' WHERE active = True and id = " + id;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Command updated successfully`);
            res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command not found`);
            res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.delete('/:id', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.id) {
            var badRequest = utility.BadRequestResult('Command id is not valid');
            res.status(400).json(badRequest);
        }

        var id = req.params.id;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `UPDATE tblCommand SET active = False WHERE active = True and id = '${id}'`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Command disabled successfully`);
            res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command not found`);
            res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

module.exports = router;