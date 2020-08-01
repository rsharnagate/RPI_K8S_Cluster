var pool = require('../db/dbMySql')
var mqtt = require('../broker/mqtt');
var express = require('express');
var cache = require('../cache');
var utility = require('../utility');

var router = express.Router();

router.post('/', async (req, res) => {
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
            return res.status(404).json({"msg": `MQTT topic not found for the device ${devId}`});
        }

        var c2d = {
            "k": cmd,
            "t": tag,
            "m": cmd.indexOf(":") > 0 
        };

        mqtt.publish(topic, c2d);
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

module.exports = router;
