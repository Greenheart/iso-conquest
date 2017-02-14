'use strict'

class Helpers {
  static randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /*
    NOTE: Expected input:
    content: {
      heading: string,
      message: string,
      actions: [
        {
          text: string,
          callback: function
        },
        {...}
      ]
    }
  */
  static displayModal (modal, content) {
    modal.querySelector('h2').innerText = content.heading
    // TODO: is message necessary? Maybe if the heading states something and the message asks a question for the user's next action
    // Or maybe, **show strategy tips**?
    if (content.message) {
      modal.querySelector('.message').innerText = content.message
    }

    const actionButtons = modal.querySelectorAll('button')
    let primaryAction

    content.actions.forEach((action, i) => {
      const btn = actionButtons[i]
      if (i === 0) primaryAction = btn

      btn.innerText = action.text
      btn.onclick = () => {
        action.callback()
        Helpers.resetModal()
      }
      Helpers.showElement(btn)
    })

    Helpers.showElement(modal.parentElement)
    primaryAction.focus()
  }

  static resetModal (modal) {
    // TODO: this won't be useful until it's possible to go back to the main menu
    // or to dismiss modals
    // TODO: test this
    Helpers.hideElement(modal.parentElement)

    modal.querySelector('h2').innerText = ''
    modal.querySelector('.message').innerText = ''
    modal.querySelectorAll('button').forEach(button => {
      Helpers.hideElement(button)
      button.onclick = null
      button.innerText = ''
    })
  }

  static showElement (element) {
    element.classList.remove('hidden')
  }

  static hideElement (element) {
    element.classList.add('hidden')
  }
}

// Polyfills
Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]))
