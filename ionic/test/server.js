var mosca = require('mosca')
var settings = {
    port: 5112,
    backend:{
        type: 'mongo',
        url:'mongodb://localhost:27017/mosca',
        pubsubCollection: 'ascoltatori',
        mongo: {}
    },
    persistence:{
        factory: mosca.persistence.Mongo,
        url: "mongodb://localhost:27017/mosca"
    }
};
var server = new mosca.Server(settings);
server.on('ready', function(){
    console.log('Mosca server is up and running');
});
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});