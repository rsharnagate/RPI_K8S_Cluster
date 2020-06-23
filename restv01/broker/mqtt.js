var mqtt = require('mqtt');
const config = require('/sl/rest/config/config.json');

var client = mqtt.connect(config.MQTT_HOST || "mqtt://127.0.0.1:1883", {
    clientId: config.MQTT_CLINTID || "RESTMqttClient",
    username: config.MQTT_USER || undefined,
    password: config.MQTT_PSWD || undefined,
    clean: true
});

client.on("connect", () => {    
    console.log(`REST MQTT client ${client.clientId} connected with broker`);
});

client.on("error", (err) => {
    console.error(err);    
});

client.on("message", (topic, message) => {
    var msg = JSON.stringify(message);
    console.log(`Message received on topic ${topic}, Msg: ${msg}`);
});

module.exports = client;