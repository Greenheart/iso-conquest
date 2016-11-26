'use strict'

class Player {
  constructor (config) {
    this.game = config.game
    this.id = config.id
    this.tileType = Map.tileTypes[this.id]
    this.areas = []
  }

  update () {
    if (this.game.turn === 0) {
      this.areas = this.getOwnAreas()
    }

  }

  display () {
    this.game.ui.playerInfo['player' + this.id].querySelector('p span').innerText = this.areas.length
  }

  getOwnAreas () {
    return this.game.currentLevel.areas.filter(area => area.owner === this)
  }

  static updateAll (players) {
    players.forEach(player => player.update())
  }

  static displayAll (players) {
    players.forEach(player => player.display())
  }
}
