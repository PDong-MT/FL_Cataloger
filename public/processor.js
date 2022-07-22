const express = require('express');
const app = express()
const net = require('net')
const http = require('http').createServer(app);
const os = require('os');
const path = require('path')
const fs = require('fs')

let fullDatagram=  ''



const remoteControl = net.createServer(conn => {
  let placeHolder = 0
  console.log('remoteControl is connected') 
  placeVal = fullDatagram.substring(0,4);

const resServer = net.createServer(resConn => {
  let placeHolder = 0
  console.log('scoreboard connection')

  resConn.on('data', data => {
    var datagram = Buffer.from(data).toString()
    // 4 characters for place, 24 characters for athlete name, 30 for affiliation
    let placeVal = datagram.substring(0,4);
    let placeNumber = parseInt(placeVal)
    let holdNumber = parseInt(placeHolder)


    if (placeNumber > holdNumber) {
      let athName = datagram.substring(4,28).trimEnd().replace(/ /g, "");
      let athAffiliation = datagram.substring(28,58).trimEnd().replace(/ /g, "")
      let time = datagram.substring(58,68).trimStart().trimEnd()
    
      let imageFileName = `${athAffiliation}_${athName}.jpg`

      conn.write(`command=ImageExport;Window=2;Time=${time};File=${imageFileName};Area=-100%,-100%,100%,100%\r`)
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


