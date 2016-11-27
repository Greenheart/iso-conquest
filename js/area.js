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
    const clickedArea = game.currentLevel.areaLookup[`${x} ${y}`]

    // only let the active player select their own areas
    if (clickedArea.owner === game.activePlayer) {
      Area.clearHighlighted()

      const previouslySelected = game.ui.areasContainer.querySelectorAll('.active-area')
      if (previouslySelected) {
        previouslySelected.forEach(area => area.classList.remove('active-area'))
      }

      const areasConquerable = Area.getAdjacent(clickedArea, 1)
                                   .filter(Area.keepNeutral)
      const areasConquerableBySacrifice = Area.getAdjacent(clickedArea, 2)
                                              .filter(Area.keepNeutral)

      if (areasConquerable.length > 0) {
        Area.highlightAdjacent(clickedArea, areasConquerable, 'conquerable')
      }

      if (areasConquerableBySacrifice.length > 0) {
        Area.highlightAdjacent(clickedArea, areasConquerableBySacrifice, 'conquerable-by-sacrifice')
      }

      const anyAdjacentIsConquerable = (areasConquerableBySacrifice.length > 0 ||
                                        areasConquerable.length > 0)

      if (anyAdjacentIsConquerable) {
        game.activePlayer.currentlySelectedArea = clickedArea
        clickedArea.viewComponent.classList.add('active-area')
      }
    } else if (clickedArea.viewComponent.classList.contains('conquerable')) {
      game.activePlayer.conquer(clickedArea, true)
    } else if (clickedArea.viewComponent.classList.contains('conquerable-by-sacrifice')) {
      game.activePlayer.conquerBySacrifice(clickedArea)
    } else {
      Area.clearHighlighted()
    }
  }

  static clearHighlighted () {
    const highlightedAreas = Area.currentlyHighlightedAreas
    if (highlightedAreas.length > 0) {
      highlightedAreas.forEach(area => {
        area.viewComponent.classList.remove('conquerable', 'conquerable-by-sacrifice')
      })

      // reset highlightedAreas
      highlightedAreas.length = 0

      for (let area of document.querySelectorAll('.active-area')) {
        area.classList.remove('active-area')
      }
    }
  }

  static highlightAdjacent (centerArea, adjacent, highlightClass) {
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
          if (adjacentArea !== undefined) {
            adjacentAreas.push(adjacentArea)
          }
        }
      }
    }

    return adjacentAreas
  }

  static removeSpecific (areaToTest, areaToRemove) {
    const xEqual = areaToTest.x === areaToRemove.x
    const yEqual = areaToTest.y === areaToRemove.y
    return !(xEqual && yEqual)
  }

  static keepNeutral (adjacentArea) {
    return Map.tileTypes[adjacentArea.tileType] === 'neutral'
  }

  static keepHostile (adjacentArea, otherPlayerId) {
    return Map.tileTypes[adjacentArea.tileType] === 'player' + otherPlayerId
  }

  static updateAll (areas) {
    areas.forEach(area => area.update())
  }

  static displayAll (areas) {
    areas.forEach(area => area.display())
  }
}

Area.currentlyHighlightedAreas = []
