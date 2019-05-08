
const dgram = require('dgram');
const HashMap = require('hashmap');
const Timestamp = require("timestamp-nano");
const net = require('net');
var map = new HashMap();
var instrument = new HashMap();

instrument.set("ti-ta-ti", "piano");
instrument.set("pouet", "trumpet");
instrument.set("trulu", "flute");
instrument.set("gzi-gzi", "violin");
instrument.set("boum-boum", "drum");

const s = dgram.createSocket('udp4');
s.bind("9907", function() {
    console.log("Joining multicast group");
    s.addMembership("239.255.22.5");
});

function Musician(uuid, inst, active) {
    this.uuid = uuid;
    this.instrument = inst;
    this.activeSince = active;
}

var server = net.createServer(function(socket) {
    socket.write(function(data){
        map.forEach(function(value, key) {
            console.log(key + " : " + value);
        });
    });
    socket.pipe(socket);
});

server.listen(2205, '127.0.0.1');

s.on('message', function (msg, source) {

    obj = JSON.parse(msg);

    var musician = new Musician(obj.uuid, instrument.get(obj.instrument), Timestamp.fromDate(new Date()).toJSON());
    if(! map.has(obj.uuid)){
        map.set(obj.uuid, musician);
    }


    map.forEach(function(value, key) {
        console.log(value.uuid + "\n" + value.instrument + "\n" + value.activeSince);
    });



});







