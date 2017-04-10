'use strict'

class Map {

}

Map.tileTypes = {
  0: 'neutral',
  1: 'player1',
  2: 'player2',

  8: 'bonus',
  9: 'rock'
}

Map.levels = {
  'intro': {
    playerCount: 2,
    description: 'Initial level',
    tiles: [
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 2]
    ]
  },
  'bonus': {
    playerCount: 2,
    description: 'Introducing bonus areas that give extra score.',
    tiles: [
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 0, 0, 8, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 0, 0, 8, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 2]
    ]
  },
  'debug': {
    playerCount: 2,
    description: 'Test that the correct winner and endgame stats are displayed.',
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [2, 1, 1, 1, 1, 1, 0, 2]
    ]
  },
  'siege': {
    playerCount: 2,
    description: 'Test that the game ends when a player can\'t make further moves.',
    tiles: [
      [1, 0, 2, 2, 2, 2, 2, 1],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 1, 1, 2],
      [2, 2, 2, 2, 2, 1, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2],
      [2, 0, 0, 0, 0, 0, 0, 2]
    ]
  }
}
