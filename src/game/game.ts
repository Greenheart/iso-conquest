interface Player {}

interface Zone {
    x: number
    y: number
    owner?: Player
    value: number
    type: ZoneType
}

interface Action {
    player: Player
    origin: Zone
    target: Zone
}

interface GameState {
    turn: number
    zones: Zone[]
    players: Player[]
}

const TileMap = {
    _: "neutral",
    b: "bonus",
    "1": "player1",
    "2": "player2",
} as const

type ValueOf<T> = T[keyof T]
type ZoneType = ValueOf<typeof TileMap>
type Tile = keyof typeof TileMap

interface Map {
    playerCount: number
    description: string
    tiles: string
}

export const MAPS = {
    intro: {
        playerCount: 2,
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
        playerCount: 2,
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

const unindent = (str: string) => str.trim().split(/\n\s+/)

const parseZone = (tile: Tile, x: number, y: number): Zone => {
    if (!TileMap.hasOwnProperty(tile)) {
        throw new Error("Unknown Tile type:" + tile)
    }

    const type = TileMap[tile]

    const zone = {
        x,
        y,
        type,
        value: type === "bonus" ? 5 : 1,
    }

    return zone
}

export function loadZones(map: Map) {
    const rawTiles = unindent(map.tiles)
    const tiles: Zone[] = []

    rawTiles.forEach((row, y) => {
        ++y
        row.split(" ").forEach((tile, x: number) => {
            // Increment by one to get coords starting at 1, 1
            ++x
            tiles.push(parseZone(tile as Tile, x, y))
        })
    })

    return tiles
}

export function newGame(players: Player[], zones: Zone[]): GameState {
    return {
        turn: 1,
        zones,
        players,
    }
}

function validateAction(action: Action) {
    if (
        action.origin.owner !== action.player ||
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
        if (zone.owner !== undefined && zone.owner !== action.player) {
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
        (score, zone) => (zone.owner === player ? score + zone.value : score),
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
