var mqtt = require('mqtt');
var client = mqtt.createClient(1883, 'localhost',{clientId:'test31',clean:false});
client.subscribe('Lobby',{qos:1});
client.on('message', function (topic, message) {
    console.log(message.toString());
});