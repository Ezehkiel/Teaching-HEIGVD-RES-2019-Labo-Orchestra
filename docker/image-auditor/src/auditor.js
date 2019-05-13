
const dgram = require('dgram');
const HashMap = require('hashmap');
const Timestamp = require("timestamp-nano");
const moment = require("moment");
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

    map.forEach(function(value, key) {
        var active = moment.utc(moment(value.activeSince).diff(moment(Timestamp.fromDate(new Date()).toJSON()))).format("ss");

        if(active < 54 && active > 0){
            console.log("Suppression de " + key);
            map.delete(key);
        }

    });
    var allMusicians = [];
    map.forEach(function(value, key) {
        allMusicians.push(value);
    });

    socket.write(JSON.stringify(allMusicians));
    socket.pipe(socket);
    socket.end();
});

server.listen(2205, '0.0.0.0');

s.on('message', function (msg, source) {

    obj = JSON.parse(msg);

    var musician = new Musician(obj.uuid, instrument.get(obj.instrument), Timestamp.fromDate(new Date()).toJSON());
    map.set(obj.uuid, musician);




});
