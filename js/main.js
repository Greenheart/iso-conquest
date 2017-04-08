'use strict'

window.DEBUG = true

document.addEventListener('DOMContentLoaded', () => {
  const finishSetup = (config) => {
    const game = new Game(config)
    game.start()
  }

  if (window.DEBUG) {
    finishSetup({ mode: 'PvAI' })
  } else {
    Helpers.displayModal(document.querySelector('.modal'), {
      heading: 'Iso Conquest',
      message: 'Select your game mode',
      backgroundColor: 'green',
      actions: [{
        text: 'PvP',
        callback: () => finishSetup({ mode: 'PvP' })
      }, {
        text: 'PvAI',
        callback: () => finishSetup({ mode: 'PvAI' })
      }]
    })
  }
})
