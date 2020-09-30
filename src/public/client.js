/**
   * @typedef {{
      objects: {
          x: any;
          y: any;
          color: any;
          drawObject: (ctx: any, size: any) => void;
      }[];
  }} Game
   */
/**
 *
 * @param {SocketIOClient.Socket} socket
 */
export function iniciarClient (socket) {
  console.log('[iniciarClient] > Iniciando...')
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas')
  /**
   * @type {CanvasRenderingContext2D}
   */
  const ctx = canvas.getContext('2d')

  /**
   * @type {Game}
   */
  var jogo
  const posi = {}
  var tamanho = 10
  const size = canvas.width / tamanho
  const colorGrid = {}

  setEvents()

  console.log('[iniciarClient] > Iniciado')

  function setEvents () {
    var lista = document.getElementById('lista')
    var userList = {}

    socket.on('boot', (game) => {
      jogo = game
      setTableColor()
      requestAnimationFrame(draw)
      document.addEventListener('click', mouseClickInGrid)
      /**
       * @param {MouseEvent} event
       */
      function getMousePos (canvas, event) {
        var rect = canvas.getBoundingClientRect()
        return {
          x: parseInt((event.clientX - rect.left) / size),
          y: parseInt((event.clientY - rect.top) / size)
        }
      }
      function mouseClickInGrid (event) {
        var pos = getMousePos(canvas, event)
        if (posi[pos.x] === undefined) {
          posi[pos.x] = {}
          socket.emit('spawn-unit', pos)
        } else if (posi[pos.x][pos.y] === undefined) {
          posi[pos.x][pos.y] = {}
          socket.emit('spawn-unit', pos)
        }
        var _objeto = posi[pos.x][pos.y]
        document.getElementById('put').innerHTML = `<h3>${_objeto}</h3>`
      }
    })

    socket.on('new-user', function (id) {
      addUserToList(id)
    })
    socket.on('remove-user', function (id) {
      removeUserFromList(id)
    })
    socket.on('change-game', (game) => {
      console.log('changeGame')
      jogo = game
    })

    function removeUserFromList (id) {
      console.log(`[remove-user] > user disconnected: ${id}`)
      lista.removeChild(userList[id])
      delete userList[id]
    }

    function addUserToList (id) {
      console.log(`[new-user] > user connected: ${id}`)
      var item = document.createElement('li')
      var text = document.createTextNode(id)
      item.appendChild(text)
      userList[id] = item
      lista.appendChild(item)
    }
  }

  function setTableColor () {
    for (let x = 0; x < tamanho; x++) {
      colorGrid[x] = {}
      for (let y = 0; y < tamanho; y++) {
        if (y % 2 !== 0) {
          if (x % 2 !== 0) {
            colorGrid[x][y] = 'rgb(200,150,100)'
          } else {
            colorGrid[x][y] = 'rgb(255,200,150)'
          }
        } else {
          if (x % 2 !== 0) {
            colorGrid[x][y] = 'rgb(255,200,150)'
          } else {
            colorGrid[x][y] = 'rgb(200,150,100)'
          }
        }
      }
    }
  }

  function draw () {
    drawBackground()

    drawObjects()

    requestAnimationFrame(draw)

    function drawObjects () {
      jogo.objects.forEach((objeto, index) => {
        drawObject(objeto, ctx, size)
        if (posi[objeto.x] === undefined) {
          posi[objeto.x] = {}
          posi[objeto.x][objeto.y] = index
        } else if (
          posi[objeto.x][objeto.y] === undefined ||
          posi[objeto.x][objeto.y] !== index
        ) {
          posi[objeto.x][objeto.y] = index
        }
      })
    }

    function drawBackground () {
      for (let x = 0; x < tamanho; x++) {
        for (let y = 0; y < tamanho; y++) {
          ctx.fillStyle = colorGrid[x][y]
          ctx.fillRect(x * size, y * size, size, size)
        }
      }
    }
  }
}

function drawObject (object, ctx, size) {
  ctx.fillStyle = object.color
  ctx.fillRect(object.x * size, object.y * size, size, size)
}
