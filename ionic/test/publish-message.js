var mqtt = require('mqtt')
    , host = 'localhost' // or localhost
    , client = mqtt.connect();
ProtoBuf = require("protobufjs");

var builder = ProtoBuf.loadProtoFile("../www/example.proto"),
    Message = builder.build("Message");

//client.subscribe('presence');
var msg = new Message('protobufjs msg', 'protobufjs msg2');
console.log(msg.toBase64());
client.publish('/sensor/OTGW/returntemp', msg.toBase64());
//client.on('message', function (topic, message) {
//    console.log(message);
//});
client.end();