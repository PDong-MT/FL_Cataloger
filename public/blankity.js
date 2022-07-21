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
const socketPort = 42003
let lynxOutputPort = 44999 || process.env.PORT
let lynxOutputHost = '127.0.0.1'
let lynxStore

const resServer = net.createServer(resConn => {
  let placeHolder = 0
  console.log('scoreboard connection')

  resConn.on('data', data => {
    var datagram = Buffer.from(data).toString()
    // 4 characters for place, 24 characters for athlete name, 30 for affiliation
    let placeVal = datagram.substring(0,4);
    let athName = datagram.substring(4,28);
    let athAffiliation = datagram.substring(28,58)
    let time = datagram.substring(58,68);

    // this is working
    if (placeVal > placeHolder) {
      getImage(datagram)
      placeHolder = placeVal
    } else {
      // nothing, program has run
    }
  })

  resConn.on('end', () => {
    console.log('client disconnected')})

})

resServer.listen(42200)

const remoteControl = net.createServer(conn => {
  console.log('remoteControl is connected') 

// next line gets info about the camera image
// conn.write('command=ImageGetInfo;Window=2\r')
// next line gets the image
// conn.write(`command=ImageExport;Window=2;Area=-100%,-100%,100%,100%;File=bazooka;Time=22.45\r`)

  conn.on('end', () => {
    console.log('client disconnected')})

})

remoteControl.listen(42000)

// const lynxServer = new net.Server()

function getImage(datagram) {
  console.log('getImage')
  let athName = datagram.substring(4,28).trimEnd().replace(/ /g, "");
  let athAffiliation = datagram.substring(28,58).trimEnd().replace(/ /g, "")
  let time = datagram.substring(58,68).trimEnd().replace(/ /g, "")

   let imageFileName = `${athAffiliation}_${athName}.jpg`
    console.log((`command=ImageExport;Window=2;Area=-100%,-100%,100%,100%;File=${imageFileName};Time=${time}\r`))
    // conn.write(`command=ImageExport;Window=2;Area=-100%,-100%,100%,100%;File=${imageFileName};Time=${time}\r`)
  }


// var onevent = client.onevent;
// client.onevent = function (packet) {
//     var args = packet.data || [];
//     onevent.call (this, packet);    // original call
//     packet.data = ["*"].concat(args);
//     onevent.call(this, packet);      // additional call to catch-all
// };




// module.exports.blankityWatcher = blankityWatcher
