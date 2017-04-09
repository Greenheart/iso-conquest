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
    this.bonusAreas = []
  }

  init () {
    this.areas = this.getOwnAreas()
    this.score = this.areas.reduce((score, area) => score + area.value, 0)
  }

  display () {
    const playerId = 'player' + this.id
    this.game.ui.playerInfo[playerId].querySelector('p span').innerText = this.score

    const bonusUI = this.game.ui.playerBonuses[playerId].children

    for (let i = 0; i < bonusUI.length; i++) {
      const area = this.bonusAreas[i]

      if (area !== undefined) {
        bonusUI[i].innerText = '+' + area.value
      } else if (bonusUI[i].innerText.length > 0) {
        bonusUI[i].classList.add('lost')
        window.setTimeout(() => {
          bonusUI[i].innerText = ''
          bonusUI[i].classList.remove('lost')
        }, 310)
      } else {
        break
      }
    }
  }

  conquer (area, shouldTryConqueringAdjacent = false) {
    // if conquerng from other player, remove area from their collection of areas they own
    if (area.owner !== null && area.owner !== this) {
      if (area.bonus) {
        area.owner.bonusAreas = area.owner.bonusAreas
                              .filter(bonus => Area.removeSpecific(bonus, area))
      }
      area.owner.score -= area.value
      area.owner.areas = area.owner.areas
                          .filter(areaToTest => Area.removeSpecific(areaToTest, area))
    }
    area.owner = this
    area.tileType = this.id

    if (area.bonus) {
      this.bonusAreas.push(area)
    }

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
        adjacentHostileAreas.forEach(a => this.conquer(a))
      }

      // this.tryConquerSiegedAreas(otherPlayerId)

      this.game.update()
      this.game.display()
      this.game.nextTurn()
    }
  }

  tryConquerSiegedAreas (otherPlayerId) {
    // Find sieged areas that cant be taken by the other player
    const otherPlayer = this.game.players
                          .find(player => player.id === otherPlayerId)
    const remainingNeutral = this.game.currentLevel.areas
                              .filter(Area.keepNeutral)

    for (const neutral of remainingNeutral) {
      debugger
      if (!neutral.isConquerableBy(otherPlayer)) {
        this.conquer(neutral)
        neutral.viewComponent.classList.add('sieged')
      }
    }
  }

  conquerBySacrifice (area) {
    // Remove the area that is to be sacrificed
    this.areas = this.areas.filter(areaToTest => Area.removeSpecific(areaToTest, this.currentlySelectedArea))
    if (this.currentlySelectedArea.bonus) {
      this.bonusAreas = this.bonusAreas
                            .filter(bonus => Area.removeSpecific(bonus, this.currentlySelectedArea))
    }
    this.currentlySelectedArea.owner = null
    this.currentlySelectedArea.viewComponent.classList.remove('player' + this.id)
    this.currentlySelectedArea.tileType = 0
    this.score -= this.currentlySelectedArea.value

    this.conquer(area, true)
  }

  getOwnAreas () {
    return this.game.currentLevel.areas.filter(area => area.owner === this)
  }

  static displayAll (players) {
    players.forEach(player => player.display())
  }
}
