'use strict'

class SimpleAi extends Player {
  constructor (config) {
    config.isAI = true
    super(config)
  }

  takeTurn () {
    const availableMoves = this.getAvailableMoves()

    if (availableMoves.length > 0) {
      const choice = Helpers.randomInt(0, availableMoves.length - 1)
      availableMoves[choice].area.viewComponent.click()
      window.setTimeout(() => {
        this.executeMove(availableMoves[choice])
      }, 350)
    }
  }

  executeMove (selectedMove) {
    const choice = Helpers.randomInt(0, selectedMove.conquerableNeighbors.length - 1)
    const areaToConquer = selectedMove.conquerableNeighbors[choice]
    window.setTimeout(() => {
      areaToConquer.viewComponent.click()
    }, 350)
  }

  getAvailableMoves () {
    const availableMoves = []

    for (const area of this.areas) {
      const conquerableNeighbors = area.adjacentAreas['all']
                                   .filter(a => a.isConquerableBy(this))
      if (conquerableNeighbors.length > 0) {
        availableMoves.push({
          area,
          conquerableNeighbors
        })
      }
    }

    return availableMoves
  }
}
