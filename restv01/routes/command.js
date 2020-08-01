const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

// Create new device command
router.post('/', async (req, res, next) => {
    let conn;
    try {

        var badRequestMsg = "";

        if (!req.body.dev_id) badRequestMsg = badRequestMsg.concat('\n Device id');
        if (!req.body.cmd) badRequestMsg = badRequestMsg.concat('\n Command');        
        if (!req.body.keys) badRequestMsg = badRequestMsg.concat('\n Keys');        

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            return res.status(400).json(badRequest);
        }        

        var devId = req.body.dev_id;
        var cmd = req.body.cmd;
        var keys = req.body.keys;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tblcommand(tblcommand.id,tblcommand.dev_id,tblcommand.cmd,tblcommand.keys) SELECT 0,tbldevices.id,'${cmd}','${keys}' FROM tbldevices WHERE id = ${devId}`;

        // Execute the query
        var dbRes = await conn.query(query);        

        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Command '${cmd}' created successfully`);
            return res.status(201).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device '${devId}' not found`);
            return res.status(404).json(result);
        }

    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

// Get all commands
router.get('/', async (req, res, next) => {
    let conn;
    try {

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT * FROM tblcommand`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Commands not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }     
});

// Get command by id
router.get('/:id/id', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.id) {
            var badRequest = utility.BadRequestResult('Command id is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT * FROM tblcommand WHERE id=${id}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command id '${id}' is not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

// Get command by name
router.get('/:cmd/cmd', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.cmd) {
            var badRequest = utility.BadRequestResult('Command is not valid');
            return res.status(400).json(badRequest);
        }

        var cmd = req.params.cmd;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT * FROM tblcommand WHERE cmd='${cmd}'`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command ${cmd} not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

// Get command by name
router.get('/:id/device', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.id) {
            var badRequest = utility.BadRequestResult('Device id is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT * FROM tblcommand WHERE dev_id='${id}'`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device ${id} is not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

// Update command
router.put('/:id', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.id) {
            var badRequest = utility.BadRequestResult('Command id is not valid');
            return res.status(400).json(badRequest);
        }        
        
        if (!req.body)  {
            var badRequest = utility.BadRequestResult('Command information is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        var query = `UPDATE tblcommand SET `;
        
        if (req.body.dev_id) {
            query = query.concat(`dev_id='${req.body.dev_id}',`);
        }
        if (req.body.cmd) {
            query = query.concat(`cmd='${req.body.cmd}',`);
        }
        if (req.body.keys) {
            query = query.concat(`keys='${req.body.keys}',`);
        }

        // Remove comma from the end
        query = query.slice(0, -1);

        query = query.concat(` WHERE id=${id}`);

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Command updated successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command ${id} is not found`);
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
            var badRequest = utility.BadRequestResult('Command id is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `DELETE FROM tblcommand WHERE id=${id}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Command '${id}' is deleted successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Command '${id}' is not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    } 
});


module.exports = router;