'use strict'

class Game {
  constructor () {
    const level = Map.levels['intro']
    this.ui = this.getDOMReferences()
    this.players = this.getPlayers(level)
    this.currentLevel = this.loadLevel(level)
    this.currentLevel.areas.forEach(a => a.init())
    this.players.forEach(player => player.init())

    this.turn = 0
    this.winner = null
    this.activePlayer = this.players[0]
  }

  start () {
    this.addEventHandlers()
    this.update()
    this.display()
  }

  update () {
    this.checkEndGameConditions()
    this.updateActivePlayer()
    Area.updateAll(this.currentLevel.areas)
    Player.updateAll(this.players)

    ++this.turn
  }

  updateActivePlayer () {
    const previousPlayerInfo = this.ui.playerInfo['player' + this.activePlayer.id]
    previousPlayerInfo.classList.remove('active-player')

    this.activePlayer = this.players[this.turn % this.players.length]
    const activePlayerInfo = this.ui.playerInfo['player' + this.activePlayer.id]
    activePlayerInfo.classList.add('active-player')
  }

  display () {
    Area.displayAll(this.currentLevel.areas)
    Player.displayAll(this.players)

    if (this.winner !== null) {
      this.endGame()
    }
  }

  checkEndGameConditions () {
    const playerOne = this.players[0]
    const playerTwo = this.players[1]
    const playerOneAreas = playerOne.areas.length
    const playerTwoAreas = playerTwo.areas.length

    if (playerOneAreas === 0) {
      this.winner = playerTwo.color
    } else if (playerTwoAreas === 0) {
      this.winner = playerOne.color
    }

    // No neutral areas left, the winner is the one with the most areas
    if (!this.currentLevel.areas.some(a => a.isNeutral())) {
      if (playerOneAreas === playerTwoAreas) {
        this.winner = 'tie'
      } else {
        this.winner = playerOneAreas > playerTwoAreas ? playerOne.color : playerTwo.color
      }
    }
  }

  endGame () {
    let message
    if (this.winner === 'tie') {
      message = 'The game was a tie!\n\nPlay again?'
    } else {
      message = `The ${this.winner} player won!\n\nPlay again?`
    }

    if (window.confirm(message)) {
      window.location.reload()
    }
  }

  loadLevel (levelConfig) {
    const level = {
      areaLookup: {}
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
          y: y
        })
      })
    })
    level.areas = Object.values(level.areaLookup)

    return level
  }

  getPlayers (level) {
    const players = []
    for (let playerId = 1; playerId <= level.playerCount; playerId++) {
      players.push(
        new Player({ id: playerId, game: this })
      )
    }

    return players
  }

  getDOMReferences () {
    return {
      gameContainer: document.querySelector('.game'),
      areasContainer: document.querySelector('.areas'),
      areas: [],
      playerInfo: {
        player1: document.querySelector('.player-info.player1'),
        player2: document.querySelector('.player-info.player2')
      }
    }
  }

  addEventHandlers () {
    document.body.addEventListener('click', event => {
      if (!event.target.classList.contains('area')) {
        Area.clearAllHighlighted()
      }
    })
  }
}
