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
const enemyHeight = playerHeight
const enemyWidth = playerWidth / 2
const enemySpeed = 2
const Enemy = (x, y, vx) => ({
  x,
  y,
  vx,
  width: enemyWidth,
  height: enemyHeight,
  color: 'red',
  hp: 1
})
const enemyRows = 3
const enemiesPerRow = 5
for (let i = 0; i < enemyRows; i++) {
  enemies[i] = []
  for (let j = 0; j < enemiesPerRow; j++) {
    enemies[i].push(Enemy(i * (enemyWidth*2), j * (enemyHeight*2)+20, enemySpeed))
  }
}

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
  for (let bi = 0; bi < bullets.length; bi++) {
    const bullet = bullets[bi]
    const {x, y, width, height, vy, color} = bullet
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    bullet.y += vy
    for (let bj = 0; bj < barriers.length; bj++) {
      const barrier = barriers[bj]
      const {x, y, width, height} = barrier
      const horizontalCollision = bullet.x > x && bullet.x < x + width
      if ((bullet.vy < 0 && horizontalCollision && bullet.y < y + height) ||
          bullet.vy > 0 && horizontalCollision && bullet.y > y - bullet.height) {
        bullets.splice(bi, 1)
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
          barriers.splice(bj, bj+1)
        }
        return
      }
    }
    for (let ei = 0; ei < enemies.length; ei++) {
      for (let ej = 0; ej < enemies[ei].length; ej++) {
        const enemy = enemies[ei][ej]
        const {x, y, width, height} = enemy
        if (bullet.x > x && bullet.x < x + width && bullet.y < y + height) {
          bullets.splice(bi, bi + 1)
          enemy.hp--
          if (enemy.hp === 0) {
            enemies[ei].splice(ej, ej+1)
          }
          return
        }
      }
    }
  }
}

const renderEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < enemies[i].length; j++) {
      const enemy = enemies[i][j]
      const {x, y, vx, width, height, color} = enemy
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)
      enemy.x += vx
      if (enemy.x > canvasSize - enemy.width || enemy.x+enemy.width < enemy.width) {
        enemy.vx = -enemy.vx
      }
      if (j === enemiesPerRow-1 && Math.random() < .01) {
        bullets.push(Bullet(x+enemyWidth/2, y+enemyHeight+10, .5))
      }
    }
  }
}

const render = () => {
  ctx.clearRect(0, 0, canvasSize, canvasSize)
  renderPlayer()
  renderBarriers()
  renderEnemies()
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