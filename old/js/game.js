'use strict'

class Game {
    constructor(config) {
        const level = Map.levels['bonus']
        this.ui = this.getDOMReferences()
        this.players = this.getPlayers(level, config.mode, config.difficulty)
        this.currentLevel = this.loadLevel(level)
        this.currentLevel.areas.forEach((a) => a.init())
        this.players.forEach((player) => player.init())

        this.turn = 0
        this.winner = null
        this.winReason = ''
        this.activePlayer = this.players[0]
    }

    start() {
        this.addEventHandlers()
        this.update()
        this.display()

        if (this.activePlayer.isAI) {
            this.activePlayer.takeTurn()
        }
    }

    update() {
        this.checkEndGameConditions()
        this.updateActivePlayer()
        Area.updateAll(this.currentLevel.areas)

        ++this.turn
    }

    nextTurn() {
        if (this.activePlayer.isAI) {
            this.activePlayer.takeTurn()
        }
    }

    updateActivePlayer() {
        const previousPlayerInfo =
            this.ui.playerInfo['player' + this.activePlayer.id]
        previousPlayerInfo.classList.remove('active-player')

        Area.removeAllAreaSelections(this)

        this.activePlayer = this.players[this.turn % this.players.length]
        const activePlayerInfo =
            this.ui.playerInfo['player' + this.activePlayer.id]
        activePlayerInfo.classList.add('active-player')
    }

    display() {
        Player.displayAll(this.players)

        if (this.winner !== null) {
            window.setTimeout(() => this.endGame(), 400)
        }
    }

    checkEndGameConditions() {
        const playerOne = this.players[0]
        const playerTwo = this.players[1]
        const playerOneAreas = playerOne.areas.length
        const playerTwoAreas = playerTwo.areas.length
        const playerOneScore = this.players[0].score
        const playerTwoScore = this.players[1].score
        const leader =
            playerOneScore > playerTwoScore ? playerOne.color : playerTwo.color
        const remainingNeutral = this.currentLevel.areas.filter((a) =>
            a.isNeutral(),
        ).length

        if (playerOneAreas === 0) {
            this.winner = playerTwo.color
        } else if (playerTwoAreas === 0) {
            this.winner = playerOne.color

            // No neutral areas left, the winner is the one with the most areas.
        } else if (remainingNeutral === 0) {
            if (playerOneScore === playerTwoScore) {
                this.winner = 'tie'
            } else {
                this.winner = leader
            }
            // If a player can't make any move, they lose despite their score.
            // This is harsh, but makes it possible to make sick comebacks.
        } else {
            for (const player of this.players) {
                if (
                    !player.areas.some(
                        (a) => a.getNeutralNeighbors().length > 0,
                    )
                ) {
                    this.winner = this.players.find(
                        (p) => p.id !== player.id,
                    ).color
                    this.winReason = `${Helpers.capitalize(
                        player.color,
                    )} ran out of moves, with only ${remainingNeutral} area${
                        remainingNeutral > 1 ? 's' : ''
                    } left to capture!\n`
                }
            }
        }
    }

    endGame() {
        const content = {
            heading: null,
            message: null,
            backgroundColor: 'green',
            actions: [
                {
                    text: 'Play Again',
                    callback: window.startNewGame,
                },
            ],
        }

        if (this.winner === 'tie') {
            content.heading = 'The game was a tie!'
            content.message = 'Perhaps you should be more aggressive?'
        } else {
            content.heading = `The ${this.winner} player won!`
            const turn = Math.floor(this.turn / 2)
            content.message = `${
                this.winReason ? this.winReason + ' ' : ``
            }The game lasted ${turn} ${turn > 1 ? 'turns' : 'turn'}.`

            const playerNumber =
                this.players.findIndex((p) => p.color === this.winner) + 1
            content.backgroundColor = `player${playerNumber}`
        }

        Helpers.displayModal(this.ui.modal, content)
    }

    loadLevel(levelConfig) {
        const level = {
            areaLookup: {},
        }

        levelConfig.tiles.forEach((row, y) => {
            ++y
            row.forEach((tileType, x) => {
                // Increment by one to get coords starting at 1, 1
                ++x
                level.areaLookup[`${x} ${y}`] = new Area({
                    game: this,
                    tileType: tileType,
                    x: x,
                    y: y,
                })
            })
        })
        level.areas = Object.values(level.areaLookup)

        return level
    }

    getPlayers(level, gameMode, difficulty) {
        const players = []

        for (let playerId = 1; playerId <= level.playerCount; playerId++) {
            const config = { id: playerId, game: this }

            if (playerId === level.playerCount && gameMode === 'PvAI') {
                const Ai = difficulty === 'easy' ? EasyAi : IntermediateAi
                players.push(new Ai(config))
            } else {
                players.push(new Player(config))
            }
        }

        return players
    }

    getDOMReferences() {
        const find = document.querySelector.bind(document)
        return {
            gameContainer: find('.game'),
            areasContainer: find('.areas'),
            areas: [],
            modal: find('.modal'),
            mainMenuContainer: find('.main-menu'),
            menu: find('.main-menu .menu'),
            prepareRound: find('main-menu .prepare-round'),
            strategyInfo: find('.main-menu .strategy-info'),
            playerInfo: {
                player1: find('.player-info.player1'),
                player2: find('.player-info.player2'),
            },
            playerBonuses: {
                player1: find('.player-bonuses.player1'),
                player2: find('.player-bonuses.player2'),
            },
        }
    }

    addEventHandlers() {
        document.body.addEventListener('click', (event) => {
            if (!event.target.classList.contains('area')) {
                Area.clearAllHighlighted()
            }
        })

        this.ui.gameContainer.addEventListener('contextmenu', (event) => {
            if (!window.DEBUG) {
                event.preventDefault()
                return false
            }
        })
    }

    clearGameBoard() {
        this.ui.areasContainer.innerHTML = ''
    }
}
