export type Player = {
    id: string
}

export interface Zone {
    x: number
    y: number
    owner?: Player
    value: number
    type: ZoneType
}

// TODO: Maybe update types to work without direct references, and instead use player ids and zone coordinates.
// By separating direct references from the core interfaces, we would make it possible to play over a network.
// It would also make actions contain less data
export interface Action {
    player: Player
    origin: Zone
    target: Zone
}

export interface GameState {
    turn: number
    zones: Zone[]
    players: Player[]
    currentPlayer: Player
    endGame?: EndGame
    zoneLookup: Record<string, Zone>
    boundaries: [number, number]
}

const ZoneScore: Record<ZoneType, number> = {
    default: 1,
    bonus: 5,
}

const PlayerTileMap = {
    "1": "player1",
    "2": "player2",
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
type ZoneType = ValueOf<typeof ZoneTileMap>
type Tile = keyof typeof TileMap
type PlayerTile = keyof typeof PlayerTileMap

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
            _ _ b _ _ b _ _
            _ _ _ _ _ _ _ _
            _ _ _ _ _ _ _ _
            _ _ b _ _ b _ _
            _ _ _ _ _ _ _ _
            2 _ _ _ _ _ _ 2
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
        tilesOld: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [2, 1, 1, 1, 1, 1, 0, 2],
        ],
    },
}

const parseTiles = (str: string) => str.trim().split(/\n\s+/)

const getPlayerForTile = (players: Player[], tile: Tile) =>
    players.find((player) => player.id === PlayerTileMap[tile as PlayerTile])

const loadZone = (
    tile: Tile,
    x: number,
    y: number,
    players: Player[],
): Zone => {
    if (!(tile in TileMap)) {
        throw new Error("Unknown Tile type:" + tile)
    }

    const owner = getPlayerForTile(players, tile)
    const type = owner ? "default" : (TileMap[tile] as ZoneType)
    const value = ZoneScore[type]

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
    return parseTiles(map.tiles).flatMap((row, y) => {
        ++y
        return row.split(" ").map((tile, x: number) => {
            // Increment by one to get coords starting at 1, 1
            ++x
            return loadZone(tile as Tile, x, y, players)
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
        currentPlayer: players[0],
        zoneLookup: getZoneLookup(zones),
        boundaries: getBoundaries(zones),
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
    if (action.origin.owner !== action.player) {
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
    if (action.player !== gameState.currentPlayer) {
        console.error(`${action.player.id} is not the current player`)
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

export const getNextPlayer = (gameState: GameState) =>
    // TODO: update to account for remaining players
    gameState.players[
        (1 +
            gameState.players.findIndex(
                (player) => player === gameState.currentPlayer,
            )) %
            gameState.players.length
    ]

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

/**
 * Prepare to get adjacent zones. Caching and additional state to optimize future executions
 * @param min Min coordinate val
 * @param max Max coordinate val
 * @param allZones Cache of all zones for quick lookups
 * @returns The curried getAdjacent(center, distance) function
 */
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

    // NOTE: Seems like the corner zones never change owner, even if the player tries conquer by sacrifice.
    // Probably is caused by the fact that allZones in this curried function is referencing the initial state which doesn't change.

    return adjacent
}

export const getZoneLookup = (zones: Zone[]) =>
    zones.reduce((lookup: Record<string, Zone>, zone) => {
        lookup[zone.x + "" + zone.y] = zone
        return lookup
    }, {})

export const getScore = (player: Player, gameState: GameState) =>
    gameState.zones.reduce(
        (score, zone) => (zone.owner === player ? score + zone.value : score),
        0,
    )

export type PlayerStats = Player & {
    score: number
}

export const getPlayerStats = (gameState: GameState): PlayerStats[] =>
    gameState.players.map((player) => ({
        ...player,
        score: getScore(player, gameState),
    }))

export enum EndGameReason {
    Elimination = "elimination",
    NoNeutral = "no-neutral",
    NoActions = "no-actions",
}

interface EndGame {
    winners: PlayerStats[]
    reason: EndGameReason
}

export const getNeighbors = (gameState: GameState, zone: Zone) => [
    ...getAdjacentZones(gameState, zone, 1),
    ...getAdjacentZones(gameState, zone, 2),
]

export const getPlayerZones = (gameState: GameState, player: Player) =>
    gameState.zones.filter((zone) => zone.owner === player)

export const keepNeutral = (zones: Zone[]) =>
    zones.filter((zone: Zone) => !zone.owner)

export const getConquerableNeighbors = (gameState: GameState, zone: Zone) =>
    keepNeutral(getNeighbors(gameState, zone))

export const hasAvailableActions = (gameState: GameState, player: Player) =>
    getPlayerZones(gameState, player).some(
        (zone) => getConquerableNeighbors(gameState, zone).length,
    )

const getWinners = (gameState: GameState) =>
    gameState.players.reduce((winners: PlayerStats[], player: Player) => {
        const score = getScore(player, gameState)
        if (!winners.length || score > winners[0].score)
            return [{ ...player, score }]
        if (score === winners[0].score)
            return [...winners, { ...player, score }]
        return winners
    }, [])

export const getEndGame = (gameState: GameState): EndGame | undefined => {
    // TODO: Adapt to work for any number of players. For example fetch all eliminated players instead of testing with players.some()
    /*
        if some player has 0 zones
            this player lost or should be eliminated from the game
        if there are no neutral zones left
            the winner is the player with the highest score
            or potentially a draw between several players
        if there are only one remaining player left
            this player won

        if some player can't make any move
            they lose despite their score.
            this is harsh, but makes it possible to make sick comebacks.
    */

    const isSomePlayerEliminated = gameState.players.some(
        (player) => !getPlayerZones(gameState, player).length,
    )

    const isEveryZoneTaken = gameState.zones.every((zone) => zone.owner)

    const isSomePlayerWithoutActions = gameState.players.some(
        (player) => !hasAvailableActions(gameState, player),
    )

    // IDEA: maybe return a list of all player scores + stats instead? Winners are simply the player(s) with the highest score
    // This would make it easier to display final stats

    if (isSomePlayerEliminated) {
        console.log(EndGameReason.Elimination, isSomePlayerEliminated)
        return {
            winners: getWinners(gameState),
            reason: EndGameReason.Elimination,
        }
    } else if (isEveryZoneTaken) {
        console.log(EndGameReason.NoNeutral, isEveryZoneTaken)
        return {
            winners: getWinners(gameState),
            reason: EndGameReason.NoNeutral,
        }
    } else if (isSomePlayerWithoutActions) {
        console.log(EndGameReason.NoActions, isSomePlayerWithoutActions)
        return {
            winners: getWinners(gameState),
            reason: EndGameReason.NoActions,
        }
    }
}

const getNextGameState = (gameState: GameState, zones: Zone[]) => {
    const next: GameState = {
        ...gameState,
        zoneLookup: getZoneLookup(zones),
        zones,
        currentPlayer: getNextPlayer(gameState),
        turn: gameState.turn + 1,
    }
    next.endGame = getEndGame(next)

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
            owner: action.player,
        }
    } else if (isNeighbor(action.target, zone)) {
        if (zone.owner && zone.owner !== action.player) {
            return {
                ...zone,
                owner: action.player,
            }
        } else {
            return zone
        }
    } else {
        return zone
    }
}
