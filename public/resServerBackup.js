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

const port = 43689

http.listen(port, () => {
  console.log('listening on *:43689');
});

io.on("connection", (socket) => {
     // (event name, data) 
     console.log(socket.handshake)
     console.log('New Results connection from ' + socket.handshake.address );   

     socket.on('results', (arg1) => {
         resServer(arg1)
     })

})

const client = ioClient('http://localhost:43689')

client.on('connect', ()=> {
     console.log('also connected')
})

// var onevent = client.onevent;
// client.onevent = function (packet) {
//     var args = packet.data || [];
//     onevent.call (this, packet);    // original call
//     packet.data = ["*"].concat(args);
//     onevent.call(this, packet);      // additional call to catch-all
// };

// client.on("*",function(event,data) {
//      console.log(event);
//      // console.log(data);

//      if (event === 'lynx.EVT') {
//           console.log('Event File Arrived')
//      } else if (event === 'lynx.PPL') {
//           console.log('People File Received')
//      } else if (event === "something") {
//           console.log('I got something')
//      } else {
//           // could be a result file
//           console.log(event)
//          // resultMaker(event, data)
//      }
//  });

//  client.on('something', (data) => {
//      console.log('data was received')
//  })


// const resultMaker = (data) => {

//     const namedFile = JSON.parse(data.results.filename)
//     const resultsFile = JSON.parse(data.results.rez)


//      fs.writeFile(`${bestpath}${namedFile}.lff`, resultsFile,  (err) => {
//           if (err) throw err;
//      })
// }

const resServer = (bestPath, data) => {
     filePath = bestPath
    console.log(filePath)
    console.log(data)

    const namedFile = JSON.parse(data.results.filename)
    const resultsFile = JSON.parse(data.results.rez)


     fs.writeFile(`${bestpath}${namedFile}.lff`, resultsFile,  (err) => {
          if (err) throw err;
     })


    
}
module.exports.resServer = resServer