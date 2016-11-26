'use strict'

class Game {
  constructor () {
    const level = Map.levels['intro']
    this.ui = this.getDOMReferences()
    this.players = this.getPlayers(level)
    this.currentLevel = this.loadLevel(level)
  }

  start () {
    this.update()
    this.display()
  }

  update () {
    Area.updateAll(this.currentLevel.areas)
  }

  display () {
    Area.displayAll(this.currentLevel.areas)
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
        new Player({ id: playerId })
      )
    }

    return players
  }

  getDOMReferences () {
    return {
      areasContainer: document.querySelector('.areas'),
      areas: []
    }
  }
}
