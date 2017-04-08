'use strict'

class Player {
  constructor (config) {
    this.game = config.game
    this.id = config.id
    this.tileType = Map.tileTypes[this.id]
    this.currentlySelectedArea = null
    this.color = this.id === 1 ? 'blue' : 'red'
    this.areas = null
    this.isAI = config.isAI || false
  }

  init () {
    this.areas = this.getOwnAreas()
    this.score = this.areas.reduce((score, area) => score + area.value, 0)
  }

  display () {
    this.game.ui.playerInfo['player' + this.id].querySelector('p span').innerText = this.score
  }

  conquer (area, shouldTryConqueringAdjacent) {
    // if conquerng from other player, remove area from their collection of areas they own
    if (area.owner !== null && area.owner !== this) {
      area.owner.score -= area.value
      area.owner.areas = area.owner.areas.filter(areaToTest => Area.removeSpecific(areaToTest, area))
    }
    area.owner = this
    area.tileType = this.id

    const otherPlayerId = this.id === 1 ? 2 : 1
    area.viewComponent.classList.remove('player' + otherPlayerId)
    area.viewComponent.classList.add('player' + this.id)
    this.areas.push(area)
    Area.clearAllHighlighted()
    this.score += area.value

    // This enables recursive conquering in one level.
    // By taking an area, you automatically get the other player's adjacent areas.
    if (shouldTryConqueringAdjacent === true) {
      const adjacentHostileAreas = area.adjacentAreas[1].filter(a => Area.keepHostile(a, this.id))

      if (adjacentHostileAreas.length > 0) {
        adjacentHostileAreas.forEach(a => this.conquer(a, false))
      }

      this.game.update()
      this.game.display()
      this.game.nextTurn()
    }
  }

  conquerBySacrifice (area) {
    // Remove the area that is to be sacrificed
    this.areas = this.areas.filter(areaToTest => Area.removeSpecific(areaToTest, this.currentlySelectedArea))
    this.currentlySelectedArea.owner = null
    this.currentlySelectedArea.viewComponent.classList.remove('player' + this.id)
    this.currentlySelectedArea.tileType = 0
    console.log(this.score)
    this.score -= this.currentlySelectedArea.value
    console.log(this.score)

    this.conquer(area, true)
  }

  getOwnAreas () {
    return this.game.currentLevel.areas.filter(area => area.owner === this)
  }

  static displayAll (players) {
    players.forEach(player => player.display())
  }
}
