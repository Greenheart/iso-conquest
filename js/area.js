'use strict'

class Area {
    constructor(config) {
        this.game = config.game
        this.owner = this.parseTileOwner(config.tileType)
        this.x = config.x
        this.y = config.y
        this.tileType = config.tileType

        if (Map.tileTypes[this.tileType] === 'bonus') {
            this.value = 5
            this.bonus = true
        } else {
            this.value = 1
            this.bonus = false
        }

        this.viewComponent = this.createViewComponent()
        this.adjacentAreas = {}
    }

    init() {
        this.cacheAdjacentAreas()
    }

    update() {
        if (
            !this.game.activePlayer.isAI &&
            this.isOwnedBy(this.game.activePlayer) &&
            this.getNeutralNeighbors().length > 0
        ) {
            this.viewComponent.classList.add('area-selectable')
        }
    }

    parseTileOwner(tileType) {
        const owners = {
            0: null,
            1: this.game.players[0],
            2: this.game.players[1],
            8: null,
            9: null,
        }

        if (tileType in owners) {
            return owners[tileType]
        }

        console.error('tileType: ' + tileType + ' is not yet implemented')
    }

    createViewComponent() {
        const area = document.createElement('div')
        area.classList.add('area')

        if (Map.tileTypes[this.tileType] === 'bonus') {
            area.classList.add('bonus')
            area.dataset.value = this.value
        }

        if (this.owner !== null) {
            area.classList.add(this.owner.tileType)
        }
        area.dataset.x = this.x
        area.dataset.y = this.y
        area.addEventListener('click', (event) => {
            Area.handleClick(event, this.game)
        })

        this.game.ui.areas.push(this.viewComponent)
        this.game.ui.areasContainer.appendChild(area)

        return area
    }

    cacheAdjacentAreas() {
        // The numbers represent the distance different areas have to this area-instance.
        // 'all' is a combined collection
        this.adjacentAreas[1] = Area.getAdjacent(this, 1)
        this.adjacentAreas[2] = Area.getAdjacent(this, 2)
        this.adjacentAreas['all'] = this.adjacentAreas[1].concat(
            this.adjacentAreas[2],
        )
    }

    isNeutral() {
        const type = Map.tileTypes[this.tileType]
        return type === 'neutral' || (type === 'bonus' && this.owner === null)
    }

    isOwnedBy(player) {
        return Map.tileTypes[this.tileType] === 'player' + player.id
    }

    isConquerable() {
        return this.owner === null
    }

    isConquerableBy(player) {
        // Does the player own any neighboring areas?
        if (this.adjacentAreas[1].some((a) => a.isOwnedBy(player))) {
            return true
        }

        // Are there any adjacent neutral areas?
        const adjacentNeutral = this.adjacentAreas[1].filter((a) =>
            a.isNeutral(),
        )
        if (adjacentNeutral.length === 0) {
            return false
        }

        // Can the player reach any of the adjacent neutral areas?
        return player.areas.some((area) =>
            adjacentNeutral.some((a) => Area.getDistance(a, area) <= 2),
        )
    }

    getNeutralNeighbors() {
        return this.adjacentAreas['all'].filter((area) => area.isNeutral())
    }

    clearAllAdjacentSelected() {
        this.adjacentAreas['all'].forEach((area) => area.clearSelection())
    }

    clearSelection() {
        if (!this.isOwnedBy(this.game.activePlayer)) {
            this.viewComponent.classList.remove('area-selectable')
        }
    }

    static handleClick(event, game) {
        // Prevent the human player from cheating by interrupting the AI's turn.
        if (game.activePlayer.isAI && event.isTrusted) return

        const clickedArea = Area.findAreaForViewComponent(event.target, game)

        // only let the active player select their own areas
        if (clickedArea.owner === game.activePlayer) {
            Area.clearAllHighlighted()

            const areasConquerable = clickedArea.adjacentAreas[1].filter(
                Area.keepNeutral,
            )
            const areasConquerableBySacrifice = clickedArea.adjacentAreas[2].filter(
                Area.keepNeutral,
            )
            let conquerableClasses = ['conquerable']
            let conquerableBySacrificeClasses = ['conquerable-by-sacrifice']

            if (game.activePlayer.isAI) {
                conquerableClasses.push('ai')
                conquerableBySacrificeClasses.push('ai')
            }

            if (areasConquerable.length > 0) {
                Area.highlightAdjacent(
                    clickedArea,
                    areasConquerable,
                    conquerableClasses,
                )
            }

            if (areasConquerableBySacrifice.length > 0) {
                Area.highlightAdjacent(
                    clickedArea,
                    areasConquerableBySacrifice,
                    conquerableBySacrificeClasses,
                )
            }

            const anyAdjacentIsConquerable =
                areasConquerableBySacrifice.length > 0 ||
                areasConquerable.length > 0

            if (anyAdjacentIsConquerable) {
                game.activePlayer.currentlySelectedArea = clickedArea
                clickedArea.viewComponent.classList.add('area-active')
            }
        } else if (
            clickedArea.viewComponent.classList.contains('conquerable')
        ) {
            game.activePlayer.conquer(clickedArea, true)
        } else if (
            clickedArea.viewComponent.classList.contains(
                'conquerable-by-sacrifice',
            )
        ) {
            game.activePlayer.conquerBySacrifice(clickedArea)
        } else {
            Area.clearAllHighlighted()
            clickedArea.clearAllAdjacentSelected()
        }
    }

    static findAreaForViewComponent(viewComponent, game) {
        const x = viewComponent.dataset.x
        const y = viewComponent.dataset.y
        return game.currentLevel.areaLookup[`${x} ${y}`]
    }

    static clearAllHighlighted() {
        const highlightedAreas = Area.currentlyHighlightedAreas
        if (highlightedAreas.length > 0) {
            const game = highlightedAreas[0].game

            highlightedAreas.forEach((area) => {
                area.viewComponent.classList.remove(
                    'conquerable',
                    'conquerable-by-sacrifice',
                    'ai',
                )
            })

            const viewComponent = game.ui.areasContainer.querySelector(
                '.area-active',
            )
            if (viewComponent !== null) {
                viewComponent.classList.remove('area-active')
                const area = Area.findAreaForViewComponent(viewComponent, game)
                area.clearAllAdjacentSelected()
            }

            // reset highlightedAreas
            highlightedAreas.length = 0
        }
    }

    static removeAllAreaSelections(game) {
        for (let viewComponent of game.ui.areasContainer.querySelectorAll(
            '.area-selectable',
        )) {
            viewComponent.classList.remove('area-selectable')
        }
    }

    static highlightAdjacent(centerArea, adjacent, highlightClasses) {
        Area.currentlyHighlightedAreas = Area.currentlyHighlightedAreas.concat(
            adjacent,
        )
        if (!centerArea.game.activePlayer.isAI) {
            highlightClasses.push('area-selectable')
        }
        adjacent.forEach((area) => {
            area.viewComponent.classList.add(...highlightClasses)
        })
    }

    static getAdjacent(centerArea, distance) {
        const adjacentAreas = []

        for (
            let y = centerArea.y - distance;
            y <= centerArea.y + distance;
            y++
        ) {
            for (
                let x = centerArea.x - distance;
                x <= centerArea.x + distance;
                x++
            ) {
                const area = { x, y }
                const actualDistance = Area.getDistance(centerArea, area)

                // 1. Don't get the target area
                // 2. Only get adjacentAreas on a given distance
                if (
                    !Area.isSame(centerArea, area) &&
                    actualDistance >= distance
                ) {
                    const adjacentArea =
                        centerArea.game.currentLevel.areaLookup[`${x} ${y}`]
                    if (adjacentArea !== undefined) {
                        adjacentAreas.push(adjacentArea)
                    }
                }
            }
        }

        return adjacentAreas
    }

    static getDistance(area1, area2) {
        return Math.round(Math.hypot(area1.x - area2.x, area1.y - area2.y))
    }

    static isSame(area1, area2) {
        return area1.x === area2.x && area1.y === area2.y
    }

    static removeSpecific(areaToTest, areaToRemove) {
        return !Area.isSame(areaToTest, areaToRemove)
    }

    static keepNeutral(area) {
        return area.isNeutral()
    }

    static keepHostile(adjacentArea, playerId) {
        const type = Map.tileTypes[adjacentArea.tileType]
        return (
            type !== 'player' + playerId &&
            type !== 'neutral' &&
            type !== 'bonus'
        )
    }

    static updateAll(areas) {
        areas.forEach((area) => area.update())
    }
}

Area.currentlyHighlightedAreas = []
