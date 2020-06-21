var mqtt = require('mqtt');
var config = require('./config.json')

var client = mqtt.connect(config.host, {
    clientId: config.client,
    //username: config.user,
    //password: config.password,
    clean: true
});

client.on("connect", () => {    
    console.log("REST connected with MQTT broker");
});

client.on("error", (err) => {
    console.error(err);    
});

client.on("message", (topic, message) => {
    
});

client.on("packetsend", (message) => {
    console.log(message);
});


module.exports = client;