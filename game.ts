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
  y: canvasSize - playerHeight * 4,
  width: playerWidth,
  height: playerHeight,
  color: 'green',
  hp: 3
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
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i]
    const {x, y, width, height, vy, color} = bullet
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    bullet.y += vy
    for (let j = 0; j < barriers.length; j++) {
      const barrier = barriers[j]
      const {x, y, width, height} = barrier
      if (bullet.x > x && bullet.x < x + width && bullet.y < y + height) {
        bullets.splice(i, i + 1)
        barrier.hp--
        switch (barrier.hp) {
          case 2:
            barrier.color = 'yellow'
            break
          case 1:
            barrier.color = 'red'
            break
        }
        if (barrier.hp === 0) {
          barriers.splice(j, j+1)
        }
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
      setTimeout(() => bulletCooldown = false, 1000)
      bullets.push(Bullet(player.x + player.width / 2 - 2, player.y - player.height, -4))
      break
  }
})