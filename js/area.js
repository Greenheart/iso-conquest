'use strict'

class Area {
  constructor (config) {
    this.game = config.game
    this.owner = this.parseTileOwner(config.tileType)
    this.x = config.x
    this.y = config.y
    this.viewComponent = this.createViewComponent()
  }

  update () {

  }

  display () {
    // display color according to who's the owner
  }

  parseTileOwner (tileType) {
    switch (tileType) {
      // NOTE: improve maintainability by adding helper method that finds the tileType keys based on their values
      // find key in object by object[key] === value.
      case 0:
        return null
      case 1:
        return this.game.players[0]
      case 2:
        return this.game.players[1]
      default:
        console.error('tileType: ' + tileType + ' is not yet implemented')
        debugger
    }
  }

  createViewComponent () {
    const area = document.createElement('div')
    area.classList.add('area')
    if (this.owner != null) {
      area.classList.add(this.owner.tileType)
    }
    area.dataset.x = this.x
    area.dataset.y = this.y
    area.setAttribute('tabindex', this.game.ui.areas.length)

    this.game.ui.areas.push(this.viewComponent)
    this.game.ui.areasContainer.appendChild(area)

    return area
  }

  static updateAll (areas) {
    areas.forEach(area => area.update())
  }

  static displayAll (areas) {
    areas.forEach(area => area.display())
  }
}
