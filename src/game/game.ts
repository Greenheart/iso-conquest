export interface Player {
    id: string
}

export interface Zone {
    x: number
    y: number
    owner?: Player["id"]
    value: number
    type: ZoneType
}

export interface Action {
    player: Player
    origin: Zone
    target: Zone
}

export interface GameState {
    turn: number
    zones: Zone[]
    players: Player[]
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

interface Map {
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
        description: "Introducing bonus areas that give extra score.",
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
}

const parseTiles = (str: string) => str.trim().split(/\n\s+/)

const getPlayerForTile = (players: Player[], tile: Tile) =>
    players.find((player) => player.id === PlayerTileMap[tile as PlayerTile])
        ?.id

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
    }
}

function validateAction(action: Action) {
    if (
        action.origin.owner !== action.player.id ||
        action.target.owner !== undefined
    ) {
        throw new Error("Impossible action")
    }
}

export function conquer(gameState: GameState, action: Action): GameState {
    validateAction(action)

    const zones = gameState.zones.map((zone) => conquerZone(zone, action))

    return {
        ...gameState,
        turn: gameState.turn + 1,
        zones,
    }
}

// TODO: rename to something
function conquerZone(zone: Zone, action: Action) {
    if (zone === action.origin) {
        return zone
    } else if (zone === action.target) {
        return {
            ...zone,
            owner: zone.owner,
        }
    } else if (isNeighbor(action.target, zone)) {
        if (zone.owner !== undefined && zone.owner !== action.player.id) {
            return {
                ...zone,
                owner: zone.owner,
            }
        } else {
            return zone
        }
    } else {
        return zone
    }
}

function isNeighbor(origin: Zone, candidate: Zone): boolean {
    return (
        origin !== candidate &&
        Math.abs(candidate.x - origin.x) <= 1 &&
        Math.abs(candidate.y - origin.y) <= 1
    )
}

export function getScore(player: Player, gameState: GameState) {
    return gameState.zones.reduce(
        (score, zone) =>
            zone.owner === player.id ? score + zone.value : score,
        0,
    )
}

export function conquerBySacrifice(
    gameState: GameState,
    action: Action,
): GameState {
    validateAction(action)

    const zones = gameState.zones.map((zone) => {
        if (zone === action.origin) {
            return {
                ...zone,
                owner: undefined,
            }
        }
        return conquerZone(zone, action)
    })

    return {
        ...gameState,
        turn: gameState.turn + 1,
        zones,
    }
}
