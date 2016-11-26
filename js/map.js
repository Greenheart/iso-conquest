'use strict'

class Map {

}

Map.tileTypes = {
  0: 'neutral',
  1: 'player1',
  2: 'player2',

  9: 'rock'
}

Map.levels = {
  'intro': {
    playerCount: 2,
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
  }
}
