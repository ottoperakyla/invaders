const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const canvasSize = canvas.width
const playerWidth = 100
const playerHeight = 20
const player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvasSize - playerHeight * 2,
  width: playerWidth,
  height: playerHeight,
  color: 'cyan',
  moveSpeed: 50,
  gun: {
    size: 15,
    color: '#ccc'
  }
}
const Barrier = x => ({
  x,
  y: canvasSize - playerHeight * 8,
  width: playerWidth,
  height: playerHeight,
  color: 'green'
})
const barriers = [Barrier(75), Barrier(325)]

const Bullet = (x, y, vy) => ({
  x,
  y,
  vy,
  width: 4,
  height: 4,
  color: 'white'
})
let bullets = []
let bulletCooldown = false

const enemies = []

const renderPlayer = () => {
  const {x, y, width, height, gun, color} = player
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
  ctx.fillStyle = gun.color
  ctx.fillRect(x + width / 2 - gun.size / 2, y - gun.size, gun.size, gun.size)
}

const renderBarriers = () => {
  for (let {x, y, width, height, color} of barriers) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
  }
}

const renderBullets = () => {
  for (let bullet of bullets) {
    const {x, y, width, height, vy, color} = bullet
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    bullet.y += vy
    for (let {x, y, width, height} of barriers) {
      if (bullet.x > x && bullet.x < x + width && bullet.y < y + height) {
        // TODO: do bullets splice or something instead of this
        bullet.width = bullet.height = 0
      }
    }
  }
}

const render = () => {
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  renderPlayer()
  renderBarriers()
  renderBullets()
  requestAnimationFrame(render)
}

requestAnimationFrame(render)

document.addEventListener('keypress', ({key}) => {
  switch(key) {
    case 'a':
      player.x = Math.max(0, player.x - player.moveSpeed)
      break
    case 'd':
      player.x = Math.min(canvas.width - player.width, player.x + player.moveSpeed)
      break
    case 'l':
      if (bulletCooldown) {
        break
      }
      bulletCooldown = true
      setTimeout(() => {
        bulletCooldown = false
      }, 1000)
      bullets.push(Bullet(player.x + player.width / 2 - 2, player.y - player.height, -4))
      break
  }
})