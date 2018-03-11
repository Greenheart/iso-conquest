(() => {
  'use strict'
  let game  // Only keep one instance at a time.
  const modal = document.querySelector('.modal')
  const mainMenu = document.querySelector('.main-menu')
  const playButton = mainMenu.querySelector('button.play')

  window.DEBUG = false
  playButton.onclick = () => window.startNewGame()

  window.startNewGame = () => {
    Helpers.hideElement(mainMenu.parentElement)
    if (game) game.clearGameBoard()

    function finishSetup (config) {
      Helpers.resetModal(modal)
      game = new Game(config)
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
})()
