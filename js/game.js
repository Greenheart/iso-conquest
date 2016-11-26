'use strict'

class Game {
  constructor () {
    const level = Map.levels['intro']
    this.ui = this.getDOMReferences()
    this.players = this.getPlayers(level)
    this.currentLevel = this.loadLevel(level)

    this.turn = 0
  }

  start () {
    this.update()
    this.display()
  }

  update () {
    Area.updateAll(this.currentLevel.areas)
    Player.updateAll(this.players)

    ++this.turn
  }

  display () {
    Area.displayAll(this.currentLevel.areas)
    Player.displayAll(this.players)
  }

  loadLevel (levelConfig) {
    const level = {
      areas: []
    }

    levelConfig.tiles.forEach((row, y) => {
      row.forEach((tileType, x) => {
        level.areas.push(
          new Area({
            game: this,
            tileType: tileType,
            x: x + 1,
            y: y + 1
          })
        )
      })
    })

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
}
