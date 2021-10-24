interface Player {}

enum ZoneType {
    Default = "default",
    Bonus = "bonus",
}

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
