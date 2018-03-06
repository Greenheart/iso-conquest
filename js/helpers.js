'use strict'

class Helpers {
  static randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /*
    NOTE: Expected input:
    content: {
      heading: string,
      backgroundColor: string,
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
    const h2 = modal.querySelector('h2')
    h2.innerText = content.heading
    h2.classList.add(content.backgroundColor)
    if (content.message) {
      modal.querySelector('.message').innerText = content.message
    }

    const actionButtons = modal.querySelectorAll('button')
    let primaryAction

    content.actions.forEach((action, i) => {
      const btn = actionButtons[i]
      if (i === 0) primaryAction = btn

      btn.innerText = action.text
      btn.onclick = () => action.callback()
      Helpers.showElement(btn)
    })

    Helpers.showElement(modal.parentElement)
    primaryAction.focus()
  }

  static resetModal (modal) {
    Helpers.hideElement(modal.parentElement)

    const h2 = modal.querySelector('h2')
    h2.innerText = ''
    h2.className = ''
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

  static capitalize (str) {
    return str[0].toUpperCase() + str.slice(1)
  }
}

// Polyfills
Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]))
