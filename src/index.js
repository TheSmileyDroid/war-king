var express = require('express')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const PORT = process.env.PORT || 3000

iniciarServer()

function iniciarServer () {
  app.use(express.static(`${__dirname}/public`))

  http.listen(PORT, () => {
    console.log('[http] > Server iniciado')
  })

  io.on('connection', (socket) => connectPlayer(socket))
}

/**
 * Conecta o Player
 * @param {SocketIO.Socket} socket
 */
function connectPlayer (socket) {
  console.log(`user connected: ${socket.id}`)
  io.emit('new-user', socket.id)
  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`)
    io.emit('remove-user', socket.id)
  })
}
