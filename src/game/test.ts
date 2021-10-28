// Test with `deno run src/game/test.ts`

import { cyan, yellow } from "https://deno.land/std@0.113.0/fmt/colors.ts"

import {
    loadMap,
    MAPS,
    newGame,
    getScore,
    Player,
    GameState,
    conquer,
    Zone,
    conquerBySacrifice,
} from "./game.ts"

const scores = (gameState: GameState) => {
    log(
        cyan("Scores"),
        gameState.players
            .map((p: Player) =>
                gameState.currentPlayer === p
                    ? yellow(`${getScore(p, gameState)}`)
                    : `${getScore(p, gameState)}`,
            )
            .join("  |  "),
    )
    return gameState
}

const log = (title = "", message = "") =>
    console.log(`${title ? `${title}: ` : ""}${message}`)

type Coordinates = [number, number]

const move =
    (action: typeof conquer | typeof conquerBySacrifice) =>
    (playerId: Player["id"], from: Coordinates, to: Coordinates) =>
    (gameState: GameState) => {
        log(action.name, `${playerId} moving from ${from} to ${to}`)
        return action(gameState, {
            player: gameState.players.find((p) => p.id === playerId) as Player,
            origin: zone(gameState, ...from),
            target: zone(gameState, ...to),
        })
    }

const take = move(conquer)
const sacrifice = move(conquerBySacrifice)

const zone = (gameState: GameState, x: number, y: number) =>
    gameState.zones.find((z) => z.x === x && z.y === y) as Zone

const pipe =
    (...fns: Array<(gameState: GameState) => GameState>) =>
    (x: GameState) =>
        fns.reduce((v, f) => f(v), x)

// IDEA: print formatted game board, using the same tiles as in the map config.
// IDEA: create a turn() helper that executes a move and then prints the game board + score, to simplify scripting the game

function main() {
    const initialState = newGame(loadMap(MAPS["bonus"]))

    pipe(
        scores,
        sacrifice("player1", [1, 1], [3, 3]),
        scores,
        take("player2", [8, 8], [6, 6]),
        sacrifice("player2", [8, 8], [6, 6]),
        scores,
        take("player1", [3, 3], [2, 3]),
        scores,
    )(initialState)
}

main()
