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

  conquer (area, shouldTryConqueringAdjacent) {
    // if conquerng from other player, remove area from their collection of areas they own
    if (area.owner !== null && area.owner !== this) {
      area.owner.areas = area.owner.areas.filter(areaToTest => Area.removeSpecific(areaToTest, area))
    }
    area.owner = this
    area.tileType = this.id

    const otherPlayerId = this.id === 1 ? 2 : 1
    area.viewComponent.classList.remove('player' + otherPlayerId)
    area.viewComponent.classList.add('player' + this.id)
    this.areas.push(area)
    Area.clearHighlighted()

    // This enables recursive conquering in one level.
    // By taking an area, you automatically get the other player's adjacent areas.
    if (shouldTryConqueringAdjacent === true) {
      const adjacentAreas = Area.getAdjacent(area, 1)
                                .filter(a => Area.keepHostile(a, otherPlayerId))

      if (adjacentAreas.length > 0) {
        adjacentAreas.forEach(a => this.conquer(a, false))
      }

      // Only update and display game once per move
      // doing it at this time prevents the game from skipping turns
        // (and letting the activePlayer keep playing more than 1 turn)
      this.game.update()
      this.game.display()
    }
  }

  conquerBySacrifice (area) {
    // Remove the area that is to be sacrificed
    this.areas = this.areas.filter(areaToTest => Area.removeSpecific(areaToTest, this.currentlySelectedArea))
    this.currentlySelectedArea.owner = null
    this.currentlySelectedArea.viewComponent.classList.remove('player' + this.id)
    this.currentlySelectedArea.tileType = 0

    this.conquer(area, true)
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
