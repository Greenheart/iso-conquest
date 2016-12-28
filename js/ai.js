'use strict'

class Ai extends Player {
  takeTurn () {
    const availableMoves = this.getAvailableMoves()

    // Ai.orderMovesByGain(availableMoves)
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
    let availableMoves = []

    for (let area of this.areas) {
      const conquerableNeighbors = area.adjacentAreas['all']
                                   .filter(a => a.isConquerableBy(this))
      if (conquerableNeighbors.length > 0) {
        availableMoves.push({
          area,
          conquerableNeighbors
          // gain: this.calculateGainOfConquer(area, conquerableNeighbors)
        })
      }
    }

    return availableMoves
  }

  // calculateGainOfConquer (areaToConquer, conquerableNeighbors) {
  //   // for area of conquerableNeighbors
  //     // simulate this.conquer
  // }

  // orderMovesByGain (availableMoves) {
  // // TODO: To improve this, store all moves as a move-objects rather
  // // than all of the ai's areas that can be used to make moves
  //   return availableMoves.sort((move1, move2) => move1.gain - move2.gain)
  // }
}
