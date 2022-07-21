const chokidar = require("chokidar");
const os = require('os');
const path = require('path')
const express = require('express')
const net = require('net');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const sockClient = require('socket.io-client')
//const csv = require('csv-parser')
 const csvtojson = require("csvtojson")
const fs = require('fs')
const ss = require('socket.io-stream')
const ioClient = require('socket.io-client');
const { emit } = require("process");

let filePath
let previousEventEmits
let previousPeopleEmits

const port = 3434

http.listen(port, () => {
  console.log('listening on *:3434');
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

const client = ioClient('http://localhost:3434')

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
     } else {
          console.log(data)
     }
 });

// Listen for eventFile
// client.on('eventFile', (data)=>{
//      console.log('eventFile received')
// })

// client.on('fileOfPeople', (data)=>{
//      console.log('peopleFile received')
// })

// client.on('resultFile', (data)=>{
//      console.log(data)
//      //  write a result file using FileSystem
// })

// client.onAny((event, ...args) => {
//      console.log(`got ${event}`);
//    });


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
          // console.log(jsonObj)
          // this path works but we need to send it someplace else
          // fs.writeFileSync('output.json', JSON.stringify(jsonObj), 'utf8', function(err){console.log(err)})
          let evtHolder = JSON.stringify(jsonObj)
          previousEventEmits = [evtHolder]
          io.emit(`${fileType}`, evtHolder)
     })
}

let peopleHolder

const peoplePostSocket = (pathway) => {
    const fileType = path.basename(pathway)
    csvtojson({
     noheader:true,
     checkType:false,
     nullObject:true
     })
     .fromFile(pathway)
     .then((jsonObj)=>{
          // console.log(jsonObj)
          // this path works but we need to send it someplace else
          // fs.writeFileSync('output.json', JSON.stringify(jsonObj), 'utf8', function(err){console.log(err)})
          peopleHolder = JSON.stringify(jsonObj)
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
               io.emit('message', 'people file found')
          } else if (fileType === 'lynx.EVT') {
               eventPostSocket(bestPath)
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