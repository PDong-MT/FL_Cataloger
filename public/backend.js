const chokidar = require("chokidar");
const os = require('os');
const path = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const csvtojson = require("csvtojson")
const fs = require('fs')
const ioClient = require('socket.io-client');
// const { emit } = require("process");
// const net = require('net');
// const ss = require('socket.io-stream')
//const csv = require('csv-parser')

let filePath
let previousEventEmits
let previousPeopleEmits

const port = 42300

http.listen(port, () => {
  console.log('listening on *:42300');
});

io.on("connection", (socket) => {
     // (event name, data) 
     console.log(socket.handshake)
     console.log('New connection from ' + socket.handshake.address );

     if (previousPeopleEmits !== undefined) {
          console.log('missed a people push')
          io.emit('lynx.PPL', previousPeopleEmits[0])
     }
     if (previousEventEmits !== undefined) {
          console.log('missed an event emit')
          io.emit('lynx.EVT', previousEventEmits[0])
     }     
})

const client = ioClient('http://localhost:43100')

client.on('connect', ()=> {
     console.log('also connected')
})

var onevent = client.onevent;
client.onevent = function (packet) {
    var args = packet.data || [];
    onevent.call (this, packet);    // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet);      // additional call to catch-all
};

client.on("*",function(event,data) {
     console.log(event);
     // console.log(data);

     if (event === 'lynx.EVT') {
          console.log('Event File Arrived')
     } else if (event === 'lynx.PPL') {
          console.log('People File Received')
     } else if (event === "something") {
          console.log('I got something')
     }else {
          // could be a result file
          console.log(event)
         // resultMaker(event, data)
     }
 });

const resultMaker = (event, data) => {
     const parsedRes = JSON.parse(data)
     fs.writeFile(`${event}.lff`, parsedRes, 'utf8', (err) => {
          if (err) throw err;
     })
}

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
             if (address.netmask === "255.255.255.0") {
               addresses.push(address.address);
             }
        }
    }
}
// returns local ip addresses

const eventPostSocket = (pathway) => {
     const fileType = path.basename(pathway)
     csvtojson({
          noheader:true,
          checkType:false,
          nullObject:true
     })
     .fromFile(pathway)
     .then((jsonObj)=>{
          let evtHolder = JSON.stringify(jsonObj)
          previousEventEmits = [evtHolder]
          io.emit(`${fileType}`, evtHolder)
     })
}

const peoplePostSocket = (pathway) => {
    const fileType = path.basename(pathway)
    csvtojson({
     noheader:true,
     checkType:false,
     nullObject:true
     })
     .fromFile(pathway)
     .then((jsonObj)=>{
          let peopleHolder = JSON.stringify(jsonObj)
          previousPeopleEmits =[peopleHolder]
          io.emit(`${fileType}`, peopleHolder)
     })
}

function startWatcher(bestPath){
     filePath = bestPath

     var watcher = chokidar.watch(bestPath, {
         ignored: /[\/\\]\./,
         persistent: true
     });

     function onWatcherReady(){
         console.info('From here can you check for real changes, the initial scan has been completed.');
     }
           
     // Declare the listeners of the watcher
     watcher
     .on('add', function(bestPath) {
          const fileType = path.basename(bestPath)

          if (fileType === 'lynx.PPL') {
               peoplePostSocket(bestPath)
          } else if (fileType === 'lynx.EVT') {
               eventPostSocket(bestPath)
          } else {
               // this might not be right, because the server should be adding this data
              // resultPostSocket(bestPath)
          }
     })
     .on('addDir', function(bestPath) {
           console.log('Directory', bestPath, 'has been added');

     })
     .on('change', function(bestPath) {
          console.log('File', bestPath, 'has been changed');
     })
     .on('unlink', function(bestPath) {
          console.log('File', bestPath, 'has been removed');
     })
     .on('unlinkDir', function(bestPath) {
          console.log('Directory', bestPath, 'has been removed');
     })
     .on('error', function(error) {
          console.log('Error happened', error);
     })
     .on('ready', onWatcherReady)
     .on('raw', function(event, bestPath, details) {
          // This event should be triggered everytime something happens.
      //    console.log('Raw event info:', event, bestPath, details);
     });
}
module.exports.startWatcher = startWatcher