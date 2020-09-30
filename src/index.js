var express = require('express')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const PORT = process.env.PORT || 3000

const game = createGame()

const changeGame = new Proxy(game, {
  set: function (target, key, value) {
    console.log('changeGame')
    io.emit('change-game', game)
    return true
  }
})

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
  socket.emit('boot', game)
  console.log(`user connected: ${socket.id}`)
  io.emit('new-user', socket.id)
  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`)
    io.emit('remove-user', socket.id)
  })

  socket.on(
    'spawn-unit',
    /**
   * @param {{
    x: number;
    y: number;
    }} pos
   */
    function (pos) {
      changeGame.objects = changeGame.objects.push(createObject(pos.x, pos.y, 'white'))
    }
  )
}

function createObject (x, y, color) {
  const object = {
    x: x,
    y: y,
    color: color
  }

  return object
}

function createGame () {
  const game = {
    objects: [createObject(3, 4, 'rgb(100,100,100)')]
  }
  return game
}
