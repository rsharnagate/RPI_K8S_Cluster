const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let conn;
    try {

        var badRequestMsg = "";

        if (!req.body.number) badRequestMsg = badRequestMsg.concat('\nChannel number');
        if (!req.body.name) badRequestMsg = badRequestMsg.concat('\nChannel name');
        if (!req.body.logo) badRequestMsg = badRequestMsg.concat('\nChannel logo');
        if (!req.body.cid) badRequestMsg = badRequestMsg.concat('\nChannel category id');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            return res.status(400).json(badRequest);
        }

        var number = req.body.number;
        var name = req.body.name;
        var logo = req.body.logo;
        var cid = req.body.cid;        

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tblchannel(number,name,logo,cid) SELECT ${number},'${name}','${logo}',tblcategory.cid FROM tblcategory WHERE cid = ${cid}`;

        // Execute the query
        var dbRes = await conn.query(query);
        
        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Channel ${name} created`);
            return res.status(201).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel category '${cid}' not found`);
            return res.status(404).json(result);
        }
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
        var query = `SELECT number, name, logo, cid FROM tblchannel`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channels not found`);
            return res.status(404).json(result);
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
            return res.status(400).json(badRequest);
        }

        var cid = req.params.cid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT number, name, logo FROM tblchannel WHERE cid=${cid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channels not found for category ${cid}`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.get('/:num/number', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.num) {
            var badRequest = utility.BadRequestResult('Channel number is not valid');
            return res.status(400).json(badRequest);
        }

        var num = req.params.num;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT name, logo, cid FROM tblchannel WHERE number=${num}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel ${num} not found`);
            return res.status(404).json(result);
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
            return res.status(400).json(badRequest);
        }

        var name = req.params.name;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT number, name, logo, cid FROM tblchannel WHERE name LIKE '%${name}%'`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel ${name} not found`);
            return res.status(404).json(result);
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
            var badRequest = utility.BadRequestResult('Channel id is not valid');
            return res.status(400).json(badRequest);
        }

        var badRequestMsg = "";
        
        if (!req.body.number) badRequestMsg = badRequestMsg.concat('\nChannel number');
        if (!req.body.name) badRequestMsg = badRequestMsg.concat('\nChannel name');
        if (!req.body.logo) badRequestMsg = badRequestMsg.concat('\nChannel logo');
        if (!req.body.cid) badRequestMsg = badRequestMsg.concat('\nChannel category id');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            return res.status(400).json(badRequest);
        }

        var cnum = req.params.number;
        var cname = req.body.name;
        var clogo = req.body.logo;
        var cid = req.body.cid;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `UPDATE tblcategory as category, tblchannel as channel
        SET channel.number = ${cnum}, channel.name = '${cname}', channel.logo = '${clogo}', channel.cid = ${cid} 
        WHERE category.cid = ${cid} and id = ${id}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Channel updated successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel or channel category not found`);
            return res.status(404).json(result);
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
            var badRequest = utility.BadRequestResult('Channel id is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `DELETE FROM tblchannel WHERE id = ${id}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Channel deleted successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    } 
});


module.exports = router;