const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

// Register new device
router.post('/', async (req, res, next) => {
    let conn;
    try {

        var badRequestMsg = "";

        if (!req.body.name) badRequestMsg = badRequestMsg.concat('\n name');
        if (!req.body.type) badRequestMsg = badRequestMsg.concat('\n type');
        if (!req.body.description) badRequestMsg = badRequestMsg.concat('\n description');
        if (!req.body.manufacturer) badRequestMsg = badRequestMsg.concat('\n manufacturer');        

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            return res.status(400).json(badRequest);
        }        

        var name = req.body.name;
        var type = req.body.type;
        var description = req.body.description;
        var manufacturer = req.body.manufacturer;
        var logo = req.body.logo_path;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tbldevices(id,name,type,description,manufacturer,logo_path) VALUES (0,'${name}','${type}','${description}','${manufacturer}','${logo}')`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        var result = utility.Result(query, dbRes, `Device '${name}' register successfully`);
        return res.status(201).json(result);

    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

// Get all register devices
router.get('/', async (req, res, next) => {
    let conn;
    try {

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT * FROM tbldevices`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Devices not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }     
});

// Get device by id
router.get('/:id/id', async (req, res, next) => {
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
        var query = `SELECT * FROM tbldevices WHERE id=${id}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device with id '${id}' not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

// Get device by name. 
// This may return multiple devices coz device name is not unique.
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
        var query = `SELECT * FROM tbldevices WHERE name='${name}'`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device with name '${name}' not found`);
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
        
        if (!req.body)  {
            var badRequest = utility.BadRequestResult('Device information is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        var query = `UPDATE tbldevices SET `;
        
        if (req.body.name) {
            query = query.concat(`name='${req.body.name}',`);
        }
        if (req.body.type) {
            query = query.concat(`type='${req.body.type}',`);
        }
        if (req.body.description) {
            query = query.concat(`description='${req.body.description}',`);
        }
        if (req.body.manufacturer) {
            query = query.concat(`manufacturer='${req.body.manufacturer}',`);
        }
        if (req.body.logo_path) {
            query = query.concat(`logo_path='${req.body.logo_path}',`);
        }

        // Remove comma from the end
        query = query.slice(0, -1);

        query = query.concat(` WHERE id=${id}`);

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Device updated successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device ${id} not found`);
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
            var badRequest = utility.BadRequestResult('Device id is not valid');
            return res.status(400).json(badRequest);
        }

        var id = req.params.id;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `DELETE FROM tbldevices WHERE id=${id}`;

        // Execute the query
        var dbRes = await conn.query(query);

        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Device '${id}' is deleted successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device '${id}' is not found`);
            return res.status(404).json(result);
        }
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    } 
});


module.exports = router;