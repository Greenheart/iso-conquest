'use strict'

class Game {
  constructor () {
    const level = Map.levels['intro']
    this.ui = this.getDOMReferences()
    this.players = this.getPlayers(level)
    this.currentLevel = this.loadLevel(level)
    this.currentLevel.areas.forEach(a => a.cacheAdjacentAreas())

    this.turn = 0
    this.winner = null
    this.activePlayer = null
  }

  start () {
    this.addEventHandlers()
    this.update()
    this.display()
  }

  update () {
    this.updateActivePlayer()
    Area.updateAll(this.currentLevel.areas)
    Player.updateAll(this.players)

    this.checkEndGameConditions()
    ++this.turn
  }

  updateActivePlayer () {
    if (this.activePlayer === null) {
      this.activePlayer = this.players[0]
    } else {
      const previousPlayerInfo = this.ui.playerInfo['player' + this.activePlayer.id]
      previousPlayerInfo.classList.remove('active-player')

      this.activePlayer = this.players[this.turn % this.players.length]
    }
    const activePlayerInfo = this.ui.playerInfo['player' + this.activePlayer.id]
    activePlayerInfo.classList.add('active-player')
  }

  display () {
    if (this.winner !== null) {
      this.endGame()
    } else {
      Area.displayAll(this.currentLevel.areas)
      Player.displayAll(this.players)
    }
  }

  checkEndGameConditions () {
    this.players.forEach(player => {
      if (player.areas.length === 0) {
        this.winner = player.getColor()
      }
    })

    // No neutral areas left, the winner is the one with the most areas
    if (!this.currentLevel.areas.some(a => a.isNeutral())) {
      if (this.players[0].areas.length === this.players[1].areas.length) {
        this.winner = 'tie'
      } else {
        // Find the player with the most area points
        const player = this.players.reduce((player, previousPlayer) => {
          if (player.areas.length > previousPlayer.areas.length) {
            return player
          } else {
            return previousPlayer
          }
        })
        this.winner = player.getColor()
      }
    }
  }

  endGame () {
    let message
    if (this.winner === 'tie') {
      message = 'The game was a tie!\n\nPlay again?'
    } else {
      message = `The ${this.winner} player won!\n\nPlay again?`
    }

    if (window.confirm(message)) {
      window.location.reload()
    }
  }

  loadLevel (levelConfig) {
    const level = {
      areaLookup: {}
    }

    levelConfig.tiles.forEach((row, y) => {
      ++y
      row.forEach((tileType, x) => {
        // Increment by one to get coords starting at 1, 1
        ++x
        level.areaLookup[`${x} ${y}`] = new Area({
          game: this,
          tileType: tileType,
          x: x,
          y: y
        })
      })
    })
    level.areas = Object.values(level.areaLookup)

    return level
  }

  getPlayers (level) {
    const players = []
    for (let playerId = 1; playerId <= level.playerCount; playerId++) {
      players.push(
        new Player({ id: playerId, game: this })
      )
    }

    return players
  }

  getDOMReferences () {
    return {
      gameContainer: document.querySelector('.game'),
      areasContainer: document.querySelector('.areas'),
      areas: [],
      playerInfo: {
        player1: document.querySelector('.player-info.player1'),
        player2: document.querySelector('.player-info.player2')
      }
    }
  }

  addEventHandlers () {
    document.body.addEventListener('click', event => {
      if (!event.target.classList.contains('area')) {
        Area.clearAllHighlighted()
      }
    })
  }
}
