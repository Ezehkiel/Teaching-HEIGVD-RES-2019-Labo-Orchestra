/*
 This program simulates a "data collection station", which joins a multicast
 group in order to receive measures published by thermometers (or other sensors).
 The measures are transported in json payloads with the following format:

   {"timestamp":1394656712850,"location":"kitchen","temperature":22.5}

 Usage: to start the station, use the following command in a terminal

   node station.js

*/

/*
 * We have defined the multicast address and port in a file, that can be imported both by
 * thermometer.js and station.js. The address and the port are part of our simple
 * application-level protocol
 */
/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind("9907", function() {
    console.log("Joining multicast group");
    s.addMembership("239.255.22.5");
});

var musician = {};
var allMusician = [];
/*
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {

    obj = JSON.parse(msg);
    musician.uuid = obj.uuid;
    musician.intrument = obj.instrument;
    allMusician.push(musician)

});
