
const dgram = require('dgram');

const uuidv4 = require('uuid/v4');

var s = dgram.createSocket('udp4');

var HashMap = require('hashmap');

function Musician(instrument) {

    this.instrument = instrument;
    this.uuid = uuidv4();

    Musician.prototype.update = function() {


        var data = {
            uuid: this.uuid,
            instrument: this.instrument
        };
        var payload = JSON.stringify(data);

        message = new Buffer(payload);
        s.send(message, 0, message.length, 9907, "239.255.22.5", function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + s.address().port);
        });

    }

    setInterval(this.update.bind(this), 1000);

}

var map = new HashMap();

map.set("piano", "ti-ta-ti");
map.set("trumpet", "pouet");
map.set("flute", "trulu");
map.set("violin", "gzi-gzi");
map.set("drum", "boum-boum");

var instrument = process.argv[2];
new Musician(map.get(instrument));