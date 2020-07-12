var pool = require('../db/dbMySql')
var mqtt = require('../broker/mqtt');
var express = require('express');

var router = express.Router();

router.post('/', (req, res) => {
    var topic = req.body.topic;
    var msg = JSON.stringify(req.body.msg);

    mqtt.publish(topic, msg);
    res.status(200).send(`Message sent on topic ${topic}, Msg: ${msg}`);    
});

module.exports = router;
