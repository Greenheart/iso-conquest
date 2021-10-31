export type Player = {
    id: PlayerId
}

export interface Zone {
    x: number
    y: number
    owner?: Player["id"]
    value: number
    type: ZoneType
}

export interface Action {
    playerId: Player["id"]
    origin: Zone
    target: Zone
}

export interface GameState {
    turn: number
    zones: Zone[]
    players: Player[]
    currentPlayer: Player["id"]
    endGame: PlayerStats[]
    zoneLookup: Record<string, Zone>
    boundaries: [number, number]
}

const ZoneValue: Record<ZoneType, number> = {
    default: 1,
    bonus: 5,
}

const PlayerTileMap = {
    "1": "player1",
    "2": "player2",
    "3": "player3",
} as const

const ZoneTileMap = {
    _: "default",
    b: "bonus",
} as const

const TileMap = {
    ...ZoneTileMap,
    ...PlayerTileMap,
} as const

type ValueOf<T> = T[keyof T]
export type PlayerId = ValueOf<typeof PlayerTileMap>
type ZoneType = ValueOf<typeof ZoneTileMap>
type PlayerTile = keyof typeof PlayerTileMap
type ZoneTile = keyof typeof ZoneTileMap

export interface Map {
    description: string
    tiles: string
}

export const MAPS = {
    intro: {
        description: "Initial level",
        tiles: `
            1 _ _ _ _ _ _ 1
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            2 _ _ _ _ _ _ 2
        `,
    },
    bonus: {
        description: "Introducing bonus zones that give extra score.",
        tiles: `
            1 _ _ _ _ _ _ 1
            _ _ _ _ _ _ _ _
            _ _ 3b _ _ 3b _ _
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            _ _ 3b _ _ 3b _ _
            _ _ _ _ _ _ _ _
            2 _ _ _ _ _ _ 2
        `,
    },
    scoresTest: {
        description: "Testing animations + transitions for player scores",
        tiles: `
            1 _ _ _ _ _ _ 1
            _ _ _ _ _ _ _ _
            _ _ _ _ _ 1b _ _
            _ _ _ _ 3 1 1 _
            _ _ _ 3 3 1 1 _
            _ _ 3b  _ b 1 _
            _ _ _ _ _ _ _ _
            2 _ _ _ _ _ _ _
        `,
    },
    debug: {
        description:
            "Test that the correct winner and endgame stats are displayed.",
        tiles: `
            1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1
            1 1 1 1 1 1 1 1
            1 1 1 1 1 _ 1 1
            2 1 1 1 1 1 _ 2
        `,
    },
    // IDEA: minify level strings in a build step (remove indentation and trim leading + ending whitespace)
    // This would save 12 * GRID_SIZE * NUMBER_OF_MAPS = 12 * 8 * 4 = 384 bytes which won't be any problem until there are more maps.
    // This would however be interesting if some kind of single player campaign is developed.
    tieOrNoAction: {
        description:
            "Test that the correct winner and endgame stats are displayed. Also testing a new parsing format.",
        tiles: `
            1 1 1 2 2 2 2 2
            _ 1 1 1 2 2 2 2
            1 1 1b 1 2 2b 2 2
            1 1 1 1 2 2 1 1
            2 1 _ 1 2 2 2 2
            2 1 1b 1 1 2b 2 2
            1 1 1 1 1 1 2 2
            1 2 2 2 1 1 2 2
        `,
        // IDEA: Explain the game rules in a help modal (i). Explain how to win, and possible ways to lose.
    },
    noActions: {
        description:
            "player2 should run out of moves and lose the game is player1 conquers [1,3]",
        tiles: `
            1 _ _ 1 1 2 3 3
            _ _ 1 1 1 2 3 3
            _ _ 1b 3 3 3b 3 3
            _ _ 1 3 3 3 3 3
            _ _ 1 3 3 3 3 3
            _ _ 1b 1 1 3b 3 3
            _ _ 3 3 3 3 3 _
            _ _ _ _ _ _ _ _
        `,
    },
    player1MissingInEndGameStats: {
        description:
            "when player1 makes the last move, they should be added to the endGame results",
        tiles: `
            3 3 3 1 3 3 1 1
            3 3 3 1 1 3 3 3
            _ 1 1b 1 1 3b 3 3
            1 1 1 1 1 3 3 3
            1 1 1 3 3 3 1 1
            3 3 3b 3 3 3b 3 1
                3 3 3 1 3 3 3 1
            _ 3 3 1 3 3 3 3
        `,
    },
    player1notWinningBug: {
        description:
            "when player2 makes their final move and run out of available moves, they should lose the game.",
        tiles: `
            1 _ _ _ 1 1 1 2
            _ _ 1 1 1 1 1 2
            _ 1 1 1 1 1 2 2
            1 1 1 1 1 1 2 2
            1 1 1 1 2 2 2 2
            1 1 1 2 2 2 2 2
            1 2 2 2 2 2 2 2
            2 2 2 2 2 2 2 _
        `,
    },
}

// IDEA: To enable saving and loading games, maybe save entire gameState.

// IDEA: Make it possible to save the game board as a string with map tiles
// This will make it easier to reproduce bugs (though the full gameState might be more useful)

const parseMap = (map: string) => map.trim().split(/\n\s+/)

const getPlayerFromTile = (players: Player[], tile: PlayerTile) =>
    players.find((player) => player.id === PlayerTileMap[tile]) as Player

const parseTile = (rawTile: string) => {
    const match = rawTile.match(/(\d{0,})(\D{0,})$/)
    if (!match) {
        throw new Error("Unable to parse raw tile" + rawTile)
    }
    return [
        match[1] ? match[1] : undefined,
        match[2] ? match[2] : undefined,
    ] as [PlayerTile | undefined, ZoneTile | undefined]
}

const loadZone = (
    rawTile: string,
    x: number,
    y: number,
    players: Player[],
): Zone => {
    const [playerTile, zoneTile] = parseTile(rawTile)

    if (playerTile && !(playerTile in PlayerTileMap)) {
        throw new Error("Unknown PlayerTile:" + playerTile)
    }

    if (zoneTile && !(zoneTile in ZoneTileMap)) {
        throw new Error("Unknown ZoneTile:" + zoneTile)
    }

    const owner = playerTile
        ? getPlayerFromTile(players, playerTile).id
        : undefined
    const type =
        (owner && zoneTile === "_") || zoneTile === undefined
            ? "default"
            : ZoneTileMap[zoneTile]
    const value = ZoneValue[type]

    const zone = {
        x,
        y,
        owner,
        type,
        value,
    }

    return zone
}

export function loadZones(map: Map, players: Player[]) {
    return parseMap(map.tiles).flatMap((row, y) => {
        ++y
        return row.split(" ").map((rawTile, x: number) => {
            // Increment by one to get coords starting at 1, 1
            ++x
            return loadZone(rawTile, x, y, players)
        })
    })
}

export function loadPlayers(map: Map["tiles"]) {
    return Object.keys(PlayerTileMap).reduce<Player[]>(
        (players, playerTile) => {
            return map.includes(playerTile)
                ? [
                      ...players,
                      {
                          id: PlayerTileMap[
                              playerTile as keyof typeof PlayerTileMap
                          ],
                      },
                  ]
                : players
        },
        [],
    )
}

export function loadMap(map: Map) {
    const players = loadPlayers(map.tiles)
    const zones = loadZones(map, players)
    return {
        players,
        zones,
    }
}

export function newGame({
    players,
    zones,
}: {
    players: Player[]
    zones: Zone[]
}): GameState {
    return {
        turn: 1,
        zones,
        players,
        currentPlayer: players[0].id,
        zoneLookup: getZoneLookup(zones),
        boundaries: getBoundaries(zones),
        endGame: [],
    }
}

/**
 * NOTE: This only works for square gridmaps
 */
const getBoundaries = (zones: Zone[]): [number, number] => [
    zones[0].x,
    (zones.at(-1) as Zone).x,
]

type ValidatorParams = { action: Action; gameState: GameState }
type ValidatorFn = (params: ValidatorParams) => boolean

const isZoneValidOrigin: ValidatorFn = ({ action }) => {
    if (action.origin.owner !== action.playerId) {
        console.error(`Zone ${coords(action.origin)} is not a valid origin`)
        return false
    }
    return true
}

const isZoneValidTarget: ValidatorFn = ({ action }) => {
    if (action.target.owner !== undefined) {
        console.error(`Zone ${coords(action.target)} is not a valid target`)
        return false
    }
    return true
}

const isActionByCurrentPlayer: ValidatorFn = ({ action, gameState }) => {
    if (action.playerId !== gameState.currentPlayer) {
        console.error(`${action.playerId} is not the current player`)
        return false
    }
    return true
}

const isZoneAtDistance = ({
    action: { origin, target },
    distance,
}: ValidatorParams & { distance: number }) => {
    if (
        !isAtDistance(origin, target, distance) &&
        Math.abs(origin.x - target.x) !== Math.abs(origin.y - target.y)
    ) {
        console.error(
            `Zones ${coords(origin)} and ${coords(
                target,
            )} are not at distance ${distance}`,
        )
        return false
    }
    return true
}

const coords = (zone: Zone) => [zone.x, zone.y]

export const getNextPlayer = (gameState: GameState) => {
    return gameState.players[
        (1 +
            gameState.players.findIndex(
                (player) => player.id === gameState.currentPlayer,
            )) %
            gameState.players.length
    ]
}

function isNeighbor(origin: Zone, candidate: Zone): boolean {
    return (
        origin !== candidate &&
        Math.abs(candidate.x - origin.x) <= 1 &&
        Math.abs(candidate.y - origin.y) <= 1
    )
}

export const isSame = (a: Zone, b: Zone) => a.x === b.x && a.y === b.y

const getDistance = (a: Zone, b: Zone) =>
    Math.round(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2))

const isAtDistance = (a: Zone, b: Zone, distance: number) => {
    const actual = getDistance(a, b)
    return actual > distance - 1 && actual < distance + 1
}

export const getAdjacentZones = (
    gameState: GameState,
    center: Zone,
    distance: number,
) => {
    const adjacent: Zone[] = []
    const [min, max] = gameState.boundaries

    for (let y = center.y - distance; y <= center.y + distance; y++) {
        if (y < min || y > max) continue
        for (let x = center.x - distance; x <= center.x + distance; x++) {
            if (x < min || x > max) continue

            if (center.x === x && center.y === y) continue
            const zone = gameState.zoneLookup[x + "" + y]

            if (getDistance(center, zone) >= distance) {
                adjacent.push(zone)
            }
        }
    }

    return adjacent
}

export const getZoneLookup = (zones: Zone[]) =>
    zones.reduce((lookup: Record<string, Zone>, zone) => {
        lookup[zone.x + "" + zone.y] = zone
        return lookup
    }, {})

export const getScore = (player: Player, gameState: GameState) =>
    gameState.zones.reduce(
        (score, zone) =>
            zone.owner === player.id ? score + zone.value : score,
        0,
    )

export const getPlayerScores = (gameState: GameState) =>
    gameState.players.map((player) => ({
        ...player,
        score: getScore(player, gameState),
    }))

export type PlayerScore = Player & {
    score: number
}

export type PlayerStats = Player & {
    score: number
    winner?: boolean
    // The reason explains How this player won or lost
    reason: EndGameReason
    turnsPlayed: number
}

export enum EndGameReason {
    Elimination = "elimination",
    NoNeutral = "no-neutral",
    NoActions = "no-actions",
    Tie = "tie",
}

export const getNeighbors = (gameState: GameState, zone: Zone) => ({
    1: getAdjacentZones(gameState, zone, 1),
    2: getAdjacentZones(gameState, zone, 2),
})

export const getPlayerZones = (gameState: GameState, player: Player) =>
    gameState.zones.filter((zone) => zone.owner === player.id)

export const keepNeutral = (zones: Zone[]) =>
    zones.filter((zone: Zone) => !zone.owner)

export const getConquerableNeighbors = (gameState: GameState, zone: Zone) => {
    const neighbors = getNeighbors(gameState, zone)
    return {
        1: keepNeutral(neighbors[1]),
        2: keepNeutral(neighbors[2]),
    }
}

export const hasConquerableNeighbors = (gameState: GameState, zone: Zone) => {
    const neighbors = getNeighbors(gameState, zone)
    return keepNeutral(neighbors[1]).length || keepNeutral(neighbors[2]).length
}

export const haveAvailableActions = (gameState: GameState, player: Player) =>
    getPlayerZones(gameState, player).some((zone) =>
        hasConquerableNeighbors(gameState, zone),
    )

const getWinners = (gameState: GameState) =>
    gameState.players.reduce((winners: PlayerStats[], player: Player) => {
        const score = getScore(player, gameState)
        if (winners.length && score < winners[0].score) return winners

        const newWinner = {
            ...player,
            score,
            winner: true,
            turnsPlayed: gameState.turn,
            reason: EndGameReason.NoNeutral,
        }

        if (!winners.length || score > winners[0].score) {
            return [newWinner]
        } else if (score === winners[0].score) {
            return [...winners, newWinner].map((winner) => ({
                ...winner,
                reason: EndGameReason.Tie,
            }))
        }

        return winners
    }, [])

export const getRemainingPlayers = (gameState: GameState) =>
    gameState.zones.reduce((players: Player[], zone) => {
        const candidate = gameState.players.find((p) => p.id === zone.owner)

        if (
            zone.owner &&
            !players.some((player) => player.id === zone.owner) &&
            candidate &&
            (gameState.currentPlayer === candidate.id
                ? haveAvailableActions(gameState, candidate)
                : true)
        ) {
            players.push(candidate)
        }
        return players
    }, [])

export const updatePlayers = (
    gameState: GameState,
    remainingPlayers: Player[],
): Pick<GameState, "players" | "endGame"> => {
    const isEveryZoneTaken = gameState.zones.every((zone) => zone.owner)

    const eliminatedPlayers = gameState.players.filter(
        (player) => !getPlayerZones(gameState, player).length,
    )

    // If one player run out of moves, they lose - not the player with the most scores.
    // IDEA: Maybe change this so that the player who locked away zones that are unreachable by others actually earn them for the final result.
    // Then calculate endgame scores like usual. This would remove the opportunity for unexpected comebacks that turn the game around. Potentially this could be an option depending on the game mode.
    const playersWithoutActions = gameState.players
        .filter(
            (player) =>
                gameState.currentPlayer === player.id &&
                !haveAvailableActions(gameState, player),
        )
        .filter((p) => !eliminatedPlayers.some(({ id }) => p.id === id))

    const winners =
        isEveryZoneTaken || remainingPlayers.length === 1
            ? getWinners({
                  ...gameState,
                  players: gameState.players.filter(
                      (player) =>
                          !(
                              playersWithoutActions.some(
                                  (p) => player.id === p.id,
                              ) ||
                              eliminatedPlayers.some((p) => player.id === p.id)
                          ),
                  ),
              })
            : []

    return {
        endGame: [
            ...winners,
            ...eliminatedPlayers?.map<PlayerStats>((player) => ({
                ...player,
                score: getScore(player, gameState),
                reason: EndGameReason.Elimination,
                turnsPlayed: gameState.turn,
            })),
            ...playersWithoutActions?.map<PlayerStats>((player) => ({
                ...player,
                score: 0,
                reason: EndGameReason.NoActions,
                turnsPlayed: gameState.turn,
            })),
            ...gameState.endGame,
        ],
        players: isEveryZoneTaken
            ? []
            : gameState.players.reduce<Player[]>((players, player) => {
                  if (remainingPlayers.some(({ id }) => player.id === id)) {
                      players.push(player)
                  }
                  return players
              }, []),
    }
}

export const isGameOver = (gameState: GameState) => gameState.players.length < 2

const getNextGameState = (gameState: GameState, zones: Zone[]) => {
    const next: GameState = {
        ...gameState,
        zoneLookup: getZoneLookup(zones),
        currentPlayer: getNextPlayer(gameState).id,
        zones,
        turn: gameState.turn + 1,
    }

    const remainingPlayers = getRemainingPlayers(next)
    const { players, endGame } = updatePlayers(next, remainingPlayers)
    next.players = players
    next.endGame = endGame

    for (const { id, reason } of endGame) {
        if (
            reason === EndGameReason.NoActions &&
            keepNeutral(next.zones).length
        ) {
            next.zones = zones.map((zone) =>
                zone.owner === id ? { ...zone, owner: undefined } : zone,
            )
        }
    }

    if (
        next.players.length > 1 &&
        next.players.length < gameState.players.length
    ) {
        const prevPlayers = gameState.players
        const prevIndex = prevPlayers.findIndex(
            (p) => p.id === gameState.currentPlayer,
        )
        for (let i = prevIndex + 1; i < prevPlayers.length; i++) {
            const candidate = prevPlayers[i].id
            if (
                candidate !== gameState.currentPlayer &&
                next.players.some((p) => p.id === candidate)
            ) {
                next.currentPlayer = candidate
                return next
            } else if (i === prevPlayers.length - 1) {
                // Set next index to -1 to compensate for i++
                i = -1
            }
        }
    }

    return next
}

export function conquer(gameState: GameState, action: Action) {
    const params = { action, gameState }
    const canConquerZone = [
        isActionByCurrentPlayer({ ...params }),
        isZoneAtDistance({ ...params, distance: 1 }),
        isZoneValidOrigin({ ...params }),
        isZoneValidTarget({ ...params }),
    ].every(Boolean)

    if (!canConquerZone) return gameState

    const zones = gameState.zones.map((zone) => conquerZone(zone, action))

    return getNextGameState(gameState, zones)
}

export function conquerBySacrifice(gameState: GameState, action: Action) {
    const params = { action, gameState }
    const canConquerZone = [
        isActionByCurrentPlayer({ ...params }),
        isZoneAtDistance({ ...params, distance: 2 }),
        isZoneValidOrigin({ ...params }),
        isZoneValidTarget({ ...params }),
    ].every(Boolean)

    if (!canConquerZone) return gameState

    const zones = gameState.zones.map((zone) => {
        if (zone === action.origin) {
            return {
                ...zone,
                owner: undefined,
            }
        }
        return conquerZone(zone, action)
    })

    return getNextGameState(gameState, zones)
}

function conquerZone(zone: Zone, action: Action) {
    if (zone === action.origin) {
        return zone
    } else if (zone === action.target) {
        return {
            ...zone,
            owner: action.playerId,
        }
    } else if (isNeighbor(action.target, zone)) {
        if (zone.owner && zone.owner !== action.playerId) {
            return {
                ...zone,
                owner: action.playerId,
            }
        } else {
            return zone
        }
    } else {
        return zone
    }
}
