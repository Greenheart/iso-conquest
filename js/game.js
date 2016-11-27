'use strict'

class Game {
  constructor () {
    const level = Map.levels['intro']
    this.ui = this.getDOMReferences()
    this.players = this.getPlayers(level)
    this.currentLevel = this.loadLevel(level)

    this.turn = 0
    this.activePlayer = null
  }

  start () {
    this.addEventHandlers()
    this.update()
    this.display()
  }

  update () {
    Area.updateAll(this.currentLevel.areas)
    Player.updateAll(this.players)

    this.updateActivePlayer()
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
    Area.displayAll(this.currentLevel.areas)
    Player.displayAll(this.players)
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
        Area.clearHighlighted()
      }
    })
  }
}
