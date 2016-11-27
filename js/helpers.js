'use strict'

class Helpers {
  static randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]))
