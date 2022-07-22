const express = require('express');
const app = express()
const net = require('net')
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const ioClient = require('socket.io-client');
const os = require('os');
const path = require('path')
const fs = require('fs')
//const { socket } = require('../src/components/socket');

// Ports
// const socketPort = 42003
// let lynxOutputPort = 44999 || process.env.PORT
// let lynxOutputHost = '127.0.0.1'
// let lynxStore

// let placeVal = 0
let fullDatagram=  ''



const remoteControl = net.createServer(conn => {
  let placeHolder = 0
  console.log('remoteControl is connected') 
  placeVal = fullDatagram.substring(0,4);

// next line gets info about the camera image
// conn.write('command=ImageGetInfo;Window=2\r')
// next line gets the image
// conn.write(`command=ImageExport;Window=2;Area=-100%,-100%,100%,100%;File=bazooka;Time=22.45\r`)

const resServer = net.createServer(resConn => {
  let placeHolder = 0
  console.log('scoreboard connection')

  resConn.on('data', data => {
    var datagram = Buffer.from(data).toString()
    // 4 characters for place, 24 characters for athlete name, 30 for affiliation
    let placeVal = datagram.substring(0,4);


    // this is working
    if (placeVal > placeHolder) {
      let athName = datagram.substring(4,28).trimEnd().replace(/ /g, "");
      let athAffiliation = datagram.substring(28,58).trimEnd().replace(/ /g, "")
      let time = datagram.substring(58,68).trimStart().trimEnd()

    
      let imageFileName = `${athAffiliation}_${athName}.jpg`


   //   conn.write (`command=ImageDraw;Window=0;Zoom=50%;HashTime=${time};\r`)
// console.log(`command=ImageExport;Window=2;Time=${time};File=${imageFileName};Area=-100%,-100%,100%,100%\r`)
     conn.write(`command=ImageExport;Window=2;Time=${time};File=${imageFileName};Area=-100%,-100%,100%,100%\r`)

    // following line is working
    //  conn.write(`command=ImageExport;Window=2;Time=22:34.83;File=${imageFileName};Area=-100%,-100%,100%,100%\r`)



      placeHolder = placeVal
    } else {
      // nothing, program has run
      console.log('I have worked through the results')
    }

    

  })

  resConn.on('end', () => {
    console.log('client disconnected')})

})

resServer.listen(42200)







  conn.on('end', () => {
    console.log('client disconnected')})

})

remoteControl.listen(42000)


// const lynxServer = new net.Server()




// var onevent = client.onevent;
// client.onevent = function (packet) {
//     var args = packet.data || [];
//     onevent.call (this, packet);    // original call
//     packet.data = ["*"].concat(args);
//     onevent.call(this, packet);      // additional call to catch-all
// };




// module.exports.blankityWatcher = blankityWatcher
