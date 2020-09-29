export function iniciarClient (socket) {
  console.log('[iniciarClient] > Iniciando...')
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas')

  setEvents()

  const objects = {
    unidade: { x: 3, y: 2, color: 'rgb(000,000,200)' },
    unidade2: { x: 6, y: 6, color: 'rgb(000,100,100)' }
  }
  /**
   * @type {CanvasRenderingContext2D}
   */
  const ctx = canvas.getContext('2d')
  var tamanho = 10
  const colorGrid = {}

  setTableColor()
  console.log(colorGrid)
  const size = canvas.width / tamanho

  requestAnimationFrame(draw)

  console.log('[iniciarClient] > Iniciado')

  function setEvents () {
    var lista = document.getElementById('lista')
    var userList = {}
    socket.on('new-user', function (id) {
      addUserToList(id)
    })
    socket.on('remove-user', function (id) {
      removeUserFromList(id)
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
      for (const id in objects) {
        const objeto = objects[id]
        ctx.fillStyle = objeto.color
        ctx.fillRect(objeto.x * size, objeto.y * size, size, size)
      }
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
