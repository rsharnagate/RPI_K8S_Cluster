var mqtt = require('mqtt');

var client = null;

try {
    const config = require('/sl/rest/config/config.json');
    client = mqtt.connect(config.MQTT_HOST || "mqtt://mosquitto.default.svc.cluster.local", {
        clientId: config.MQTT_CLINTID || "RESTMqttClient",
        username: config.MQTT_USER,
        password: config.MQTT_PSWD,
        clean: true
    });
} catch (err) {
    console.error("config.json not found. Loading default values.");
    client = mqtt.connect("mqtt://localhost", {
        clientId: "RESTMqttClient",
        clean: true
    });
}

client.on("connect", () => {    
    console.log(`REST MQTT client connected with broker`);
});

client.on("error", (err) => {
    console.error(err);    
});

client.on("message", (topic, message) => {
    var msg = JSON.stringify(message);
    console.log(`Message received on topic ${topic}, Msg: ${msg}`);
});

module.exports = client;