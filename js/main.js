'use strict'

window.DEBUG = false

window.onload = () => {
  const modal = document.querySelector('.modal')

  function finishSetup (config) {
    Helpers.resetModal(modal)
    const game = new Game(config)
    game.start()
  }

  function setDifficulty () {
    Helpers.displayModal(modal, {
      heading: 'Iso Conquest',
      message: 'Select your difficulty',
      backgroundColor: 'green',
      actions: [{
        text: 'Easy',
        callback: () => finishSetup({ mode: 'PvAI', difficulty: 'easy' })
      }, {
        text: 'Intermediate',
        callback: () => finishSetup({ mode: 'PvAI', difficulty: 'intermediate' })
      }]
    })
  }

  if (window.DEBUG) {
    finishSetup({ mode: 'PvAI', difficulty: 'intermediate' })
  } else {
    Helpers.displayModal(modal, {
      heading: 'Iso Conquest',
      message: 'Select your game mode',
      backgroundColor: 'green',
      actions: [{
        text: 'PvP',
        callback: () => finishSetup({ mode: 'PvP' })
      }, {
        text: 'PvAI',
        callback: () => setDifficulty()
      }]
    })
  }
}
