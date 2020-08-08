const mysql = require('../db/dbMySql');
var mqtt = require('../broker/mqtt');
var express = require('express');
var cache = require('../cache');
var utility = require('../utility');
const { json } = require('body-parser');

var router = express.Router();

router.post('/power', async (req, res) => {
    try {
        // check required parameter
        if (!req.body.dev_id || !req.body.cmd) {        
            return res.status(400).json({"msg": "Please provide all mandatory information"});
        }
        
        var devId = req.body.dev_id;
        var cmd = req.body.cmd;
        var tag = req.body.tag || null;

        // get topic associated with this device
        var topic = await utility.GetTopic(devId);

        // topic not found
        if (topic == null) {
            return res.status(404).json({"msg": `MQTT topic not found for the device id ${devId}`})
        }

        // get command info
        var cmd = await GetCommand(devId, cmd);

        if (cmd == null) {
            return res.status(404).json({"msg": `Command ${cmd} not found for the device id ${devId}`})
        }

        var c2d = {
            "k": cmd,
            "t": tag,
            "m": cmd.indexOf(":") > 0 
        };

        mqtt.publish(topic, JSON.stringify(c2d));
        
        return res.status(200).json(            
        {
            "msg": `Command ${cmd} sent to device ${devId} on topic ${topic}`, 
            "c2d": c2d
        });        

    } catch (err) {
        return res.status(500).json(
            {
                "msg": "Failed to publish cmd",
                "err": err
            });
    }
});

router.post('/channel', async (req, res) => {
    // cmd = ChannelUp      tag = null
    // cmd = ChannelDown    tag = null
    // cmd = ChangeChannel  tag = 670/Nick
    try {
        
        // check required parameter
        if (!req.body.dev_id && !req.body.cmd) {        
            return res.status(400).json({"msg": "Please provide all mandatory information"});
        }

        var devId = req.body.dev_id;
        var cmd = req.body.cmd;
        var tag = req.body.tag || null;

        // get topic associated with this device
        var topic = await utility.GetTopic(devId);
        if (topic == null) {
            return res.status(404).json({"msg": `MQTT topic not found for the device ${device}`});
        }       
        
        var dbCmd = cmd;
        
        if (tag != null) {
            dbCmd = await GetChannel(tag, devId);
            if (dbCmd == null) {
                return res.status(404).json({"msg": `Channel ${dbCmd} not found for the device ${device}`})
            }
        }       

        // get command info
        var cmdInfo = await GetCommand(devId, dbCmd);
        if (cmdInfo == null) {
            return res.status(404).json({"msg": `Command ${dbCmd} not found for the device id ${devId}`})
        }              

        var c2d = {
            "k": cmdInfo,
            "t": tag,
            "m": cmdInfo.indexOf(":") > 0 
        };

        mqtt.publish(topic, JSON.stringify(c2d));
        return res.status(200).json(            
            {
                "msg": `Message sent on topic ${topic}`, 
                "c2d": c2d
            });

    } catch (err) {
        return res.status(500).json(
            {
                "msg": "Failed to publish cmd",
                "err": err
            });
    }
});

router.post('/volume', async (req, res) => {
    // cmd = VolumeUp      tag = 10/null
    // cmd = VolumeDown    tag = 10/null
    // cmd = Mute          tag = true/false
    try {

        // check required parameter
        if (!req.body.dev_id || !req.body.cmd) {        
            return res.status(400).json({"msg": "Please provide all mandatory information"});
        }
        
        var devId = req.body.dev_id;
        var cmd = req.body.cmd;
        var tag = req.body.tag || null;

        // get topic associated with this device
        var topic = await utility.GetTopic(devId);
        // topic not found
        if (topic == null) {
            return res.status(404).json({"msg": `MQTT topic not found for the device ${device}`})
        }        

        // get commond info
        var cmdInfo = await GetCommand(devId, cmd);
        // command not found
        if (cmdInfo == null) {
            return res.status(404).json({"msg": `Command not found for the device id ${devId}`})
        }

        var c2d = {
            "k": cmdInfo,
            "t": tag,
            "m": cmdInfo.indexOf(":") > 0 
        };

        mqtt.publish(topic, JSON.stringify(c2d));
        return res.status(200).json(            
            {
                "msg": `Message sent on topic ${topic}`, 
                "c2d": c2d
            });
    } catch (err) {
        return res.status(500).json(
            {
                "msg": "Failed to publish cmd",
                "err": err
            });
    }
});

async function GetChannel(channel, devId) {

    var cKey = 'GetChannel-' + devId + "-" + channel;
    
    // check channel info in cache
    var channelInfo = cache.read(cKey);
    if (channelInfo != null) {
        console.log('Reading channel info from cache');
        return topic;
    }
    
    console.log('Reading channel info from db');

    let conn;

    try {

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        var query = 'SELECT number FROM tblchannel WHERE ';

        if (isNaN(channel)) {
            query = query.concat(`name LIKE '%${channel}%'`);
        } else {
            query = query.concat(`number = ${channel}`);
        }

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {            
            var number = dbRes[0].number;
            cache.store(cKey, number);
            return number;
        } else {
            return null;            
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};

async function GetCommand(devId, cmd) {
    var cKey = 'GetCommand-' + devId + "-" + cmd;
    
    // check channel info in cache
    var channelInfo = cache.read(cKey);
    if (channelInfo != null) {
        console.log(`Reading device '${devId}' command info from cache`);
        return channelInfo;
    }
    
    console.log(`Reading device '${devId}' command info from db`);

    let conn;

    try {

        // establish connection with MariaDB
        conn = await mysql.getConnection();

        var query = `SELECT tblcommand.keys FROM tblcommand WHERE dev_id = ${devId} and cmd = '${cmd}'`;

        // Execute the query
        var dbRes = await conn.query(query);

        // Respond to the user
        if (dbRes.length > 0) {            
            var cmdInfo = dbRes[0].keys;
            cache.store(cKey, cmdInfo);
            return cmdInfo;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = router;
