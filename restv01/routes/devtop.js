const mysql = require('../db/dbMySql');
const express = require('express');
const utility = require('../utility');

var router = express.Router();

router.post('/', async (req, res, next) => {
    let conn;
    try {

        var badRequestMsg = "";

        if (!req.body.dev_id) badRequestMsg = badRequestMsg.concat('\nDevice id');
        if (!req.body.topic) badRequestMsg = badRequestMsg.concat('\nTopic');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            return res.status(400).json(badRequest);
        }        

        var devId = req.body.dev_id;
        var topic = req.body.topic;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `INSERT INTO tbldevicetopic(id,dev_id,topic) SELECT 0, tbldevices.id, '${topic}' FROM tbldevices WHERE id = ${devId}`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Device ${devId} mapped with topic ${topic}`);
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

router.get('/', async (req, res, next) => {
    let conn;
    try {

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = 'SELECT * FROM tbldevicetopic';

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Mappings not found`);
            return res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.get('/:devId', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.devId) {
            var badRequest = utility.BadRequestResult('Device is not valid');
            return res.status(400).json(badRequest);
        }

        var devId = req.params.devId;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `SELECT id, topic FROM tbldevicetopic WHERE dev_id = ${devId}`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {
            var result = utility.OkResult(query, dbRes);
            return res.status(200).json(result);
        } else {
            var result = utility.Result(query, dbRes, `MQTT topic not found for device id ${devId}`);
            return res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

router.put('/:device', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.device) {
            var badRequest = utility.BadRequestResult('Device is not valid');
            return res.status(400).json(badRequest);
        }

        var badRequestMsg = "";

        if (!req.body.topic) badRequestMsg = badRequestMsg.concat('\nTopic');

        if (badRequestMsg) {
            badRequestMsg = 'Mandatory fields are missing:'.concat(badRequestMsg);
            var badRequest = utility.BadRequestResult(badRequestMsg);
            return res.status(400).json(badRequest);
        }

        var device = req.params.device;
        var topic = req.body.topic;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `UPDATE tbldevicetopic SET topic = '${topic}' WHERE device = '${device}'`;
        //"UPDATE tbldevicetopic SET topic = '" + topic + "' WHERE active = True and device = '" + device + "'";

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Mapping updated successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device not found`);
            return res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }   
});

router.delete('/:device', async (req, res, next) => {
    let conn;
    try {

        // Check required parameter
        if (!req.params.device) {
            var badRequest = utility.BadRequestResult('Device is not valid');
            return res.status(400).json(badRequest);
        }

        var device = req.params.device;

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        // Create new query
        var query = `DELETE FROM tbldevicetopic WHERE device = '${device}'`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.affectedRows > 0) {
            var result = utility.Result(query, dbRes, `Device mapping deleted successfully`);
            return res.status(204).json(result);
        } else {
            var result = utility.Result(query, dbRes, `Device not found`);
            return res.status(404).json(result);
        }        
    } catch (err) {        
        return next(err);
    } finally {
        if (conn) return conn.release();
    }    
});

module.exports = router;