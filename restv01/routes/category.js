const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.body.name) {
            var badRequest = BadRequestResult('Category name is not valid');
            return res.status(400).json(badRequest);
        }

        var cName = req.body.name;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tblCategory VALUES (0, '${cName}', True)`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        var result = utility.Result(query, dbRes, `Channel category ${cName} created`);
        return res.status(201).json(result);

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
        var query = `SELECT cid, name FROM tblCategory WHERE active = True`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel category not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

router.get('/:cid', async (req, res, next) => {
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
        var query = `SELECT cid, name FROM tblCategory WHERE cid = ${cid} and active = True`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel category not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }
});

router.put('/:cid', async (req, res, next) => {
    let conn;
    try {        

        // Check required parameter
        if (!req.params.cid) {
            var badRequest = utility.BadRequestResult('Category id is not valid');
            return res.status(400).json(badRequest);
        }

        if (!req.body.name) {
            var badRequest = utility.BadRequestResult('Category name is not valid');
            return res.status(400).json(badRequest);
        }

        var cid = req.params.cid;
        var cname = req.body.name;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `UPDATE tblCategory SET name = '${cname}' WHERE active = True and cid = ${cid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Category updated successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel category not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.delete('/:cid', async (req, res, next) => {
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
        var query = `UPDATE tblCategory SET active = False WHERE active = True and cid = ${cid}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Category disabled successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Channel category not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

module.exports = router;