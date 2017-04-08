'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const DEV = false

  const finishSetup = (config) => {
    const game = new Game(config)
    game.start()
  }

  if (DEV) {
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
