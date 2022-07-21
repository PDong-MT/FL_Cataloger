const os = require('os');
const path = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const fs = require('fs')
const ioClient = require('socket.io-client');


function resultWatcher(bestPath) {
    return finalPath = bestPath
}
module.exports.resultWatcher = resultWatcher

console.log(resultWatcher)

const port = 41600

http.listen(port, () => {
  console.log('listening on *:41600');
});

io.on("connection", (socket) => {
     // (event name, data) 
     console.log(socket.handshake)
     console.log('New Results connection from ' + socket.handshake.address );   

     socket.on('results', (arg1) => {
         respost(arg1)
     })

})

const client = ioClient('http://localhost:40009')

client.on('connect', ()=> {
     console.log('also connected')
})


const respost = (data) => {
    const namedFile = JSON.parse(data.results.filename)
    const resultsFile = JSON.parse(data.results.rez)
    
    console.log(finalPath)
     fs.writeFile(`${finalPath}/${namedFile}.lff`, resultsFile,  (err) => {
          if (err) throw err;
     })

}


