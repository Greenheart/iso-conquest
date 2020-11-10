'use strict'

class IntermediateAi extends Player {
    constructor(config) {
        config.isAI = true
        super(config)
    }

    takeTurn() {
        const move = this.getBestMove()

        if (move) {
            move.area.viewComponent.click()
            window.setTimeout(() => {
                this.executeMove(move.target)
            }, 350)
        }
    }

    executeMove(areaToConquer) {
        window.setTimeout(() => {
            areaToConquer.viewComponent.click()
        }, 350)
    }

    getBestMove() {
        return this.areas.reduce((best, area, i) => {
            const conquerableNeighbors1 = area.adjacentAreas[1]
                .filter((a) => a.isConquerable())
                .map((a) => ({
                    area: a,
                    distance: 1,
                }))

            const conquerableNeighbors2 = area.adjacentAreas[2]
                .filter((a) => a.isConquerable())
                .map((a) => ({
                    area: a,
                    distance: 2,
                }))

            const conquerableNeighbors = conquerableNeighbors1.concat(
                conquerableNeighbors2,
            )

            // Find the best place to expand
            for (const areaToConquer of conquerableNeighbors) {
                const conquerableFromOpponent = areaToConquer.area.adjacentAreas[1].filter(
                    (a) => Area.keepHostile(a, this.id),
                )

                const gain = this.calculateGainOfConquer(
                    areaToConquer,
                    conquerableFromOpponent.length,
                    area.value,
                )
                // The target is the optimal area to conquer (At least in a short perspective)
                // The area is the optimal starting point
                if (best === undefined || gain > best.gain) {
                    best = { target: areaToConquer.area, gain, area }
                }
            }

            return best
        }, undefined)
    }

    calculateGainOfConquer(
        areaToConquer,
        areasConquerableFromOpponent,
        sacrifice,
    ) {
        let gain = 0

        if (areaToConquer.distance === 1) {
            gain += areaToConquer.area.value
        } else {
            gain += areaToConquer.area.value - sacrifice
        }

        return gain + areasConquerableFromOpponent
    }
}
