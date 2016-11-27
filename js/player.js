'use strict'

class Player {
  constructor (config) {
    this.game = config.game
    this.id = config.id
    this.tileType = Map.tileTypes[this.id]
    this.currentlySelectedArea = null
  }

  update () {
    if (this.game.turn === 0) {
      this.areas = this.getOwnAreas()
    }
  }

  display () {
    this.game.ui.playerInfo['player' + this.id].querySelector('p span').innerText = this.areas.length
  }

  conquer (area) {
    area.owner = this
    area.tileType = this.id
    area.viewComponent.classList.add('player' + this.id)
    Area.clearHighlighted()
    this.areas.push(area)
    this.game.update()
    this.game.display()
  }

  conquerBySacrifice (area) {
    this.currentlySelectedArea.owner = null
    this.currentlySelectedArea.viewComponent.classList.remove('player' + this.id)
    this.currentlySelectedArea.tileType = 0
    this.conquer(area)
    this.areas = this.areas.filter(a => (a.x !== area.x && a.y !== area.y))
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
