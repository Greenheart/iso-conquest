'use strict'

class Area {
  constructor (config) {
    this.game = config.game
    this.owner = this.parseTileOwner(config.tileType)
    this.x = config.x
    this.y = config.y
    this.tileType = config.tileType
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
    }
  }

  createViewComponent () {
    const area = document.createElement('div')
    area.classList.add('area')

    if (this.owner !== null) {
      area.classList.add(this.owner.tileType)
    }
    area.dataset.x = this.x
    area.dataset.y = this.y
    area.setAttribute('tabindex', this.game.ui.areas.length)

    area.addEventListener('click', event => {
      Area.handleClick(event, this.game)
    })

    this.game.ui.areas.push(this.viewComponent)
    this.game.ui.areasContainer.appendChild(area)

    return area
  }

  static handleClick (event, game) {
    const x = event.target.dataset.x
    const y = event.target.dataset.y
    const area = game.currentLevel.areaLookup[`${x} ${y}`]

    // only let the active player select their own areas
    if (area.owner === game.activePlayer) {
      Area.clearHighlighted()
      Area.highlightAdjacent(area, 1, 'conquerable')
      Area.highlightAdjacent(area, 2, 'conquerable-by-sacrifice')
      game.activePlayer.currentlySelectedArea = area
    } else if (area.viewComponent.classList.contains('conquerable')) {
      game.activePlayer.conquer(area)
    } else if (area.viewComponent.classList.contains('conquerable-by-sacrifice')) {
      game.activePlayer.conquerBySacrifice(area)
    } else {
      Area.clearHighlighted()
    }
  }

  static clearHighlighted () {
    if (Area.currentlyHighlightedAreas.length > 0) {
      Area.currentlyHighlightedAreas.forEach(area => {
        area.viewComponent.classList.remove('conquerable', 'conquerable-by-sacrifice')
      })
    }
  }

  static highlightAdjacent (area, distance, highlightClass) {
    const adjacent = Area.getAdjacent(area, distance)
    Area.currentlyHighlightedAreas = Area.currentlyHighlightedAreas.concat(adjacent)
    adjacent.forEach(area => area.viewComponent.classList.add(highlightClass))
  }

  static getAdjacent (area, distance) {
    const adjacentAreas = []

    for (let y = area.y - distance; y <= area.y + distance; y++) {
      for (let x = area.x - distance; x <= area.x + distance; x++) {
        const actualDistance = Math.round(Math.hypot(x - area.x, y - area.y))

        // 1. Don't get the target area
        // 2. Only get adjacentAreas on a given distance
        if (!(x === area.x && y === area.y) && actualDistance >= distance) {
          const adjacentArea = area.game.currentLevel.areaLookup[`${x} ${y}`]
          // 1. Only add valid areas
          // 2. Areas have to be neutral
          if (adjacentArea !== undefined && Map.tileTypes[adjacentArea.tileType] === 'neutral') {
            adjacentAreas.push(adjacentArea)
          }
        }
      }
    }

    return adjacentAreas
  }

  static updateAll (areas) {
    areas.forEach(area => area.update())
  }

  static displayAll (areas) {
    areas.forEach(area => area.display())
  }
}

Area.currentlyHighlightedAreas = []
