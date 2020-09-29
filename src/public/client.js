export function iniciarClient (socket) {
  console.log('[iniciarClient] > Iniciando...')
  var lista = document.getElementById('lista')
  var userList = {}
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('canvas')

  socket.on('new-user', function (id) {
    console.log(`[new-user] > user connected: ${id}`)
    var item = document.createElement('li')
    var text = document.createTextNode(id)
    item.appendChild(text)
    userList[id] = item
    lista.appendChild(item)
  })
  socket.on('remove-user', function (id) {
    console.log(`[remove-user] > user disconnected: ${id}`)
    lista.removeChild(userList[id])
    delete userList[id]
  })
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
  console.log(colorGrid)
  const size = canvas.width / tamanho
  requestAnimationFrame(draw)

  console.log('[iniciarClient] > Iniciado')

  function draw () {
    for (let x = 0; x < tamanho; x++) {
      for (let y = 0; y < tamanho; y++) {
        ctx.fillStyle = colorGrid[x][y]
        ctx.fillRect(x * size, y * size, size, size)
      }
    }

    for (const id in objects) {
      const objeto = objects[id]
      ctx.fillStyle = objeto.color
      ctx.fillRect(objeto.x * size, objeto.y * size, size, size)
    }

    requestAnimationFrame(draw)
  }
}
