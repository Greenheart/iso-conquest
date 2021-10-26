// Test with `deno run src/game/test.ts`

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

const initialState = newGame(loadMap(MAPS["bonus"]))

const scores = (gameState: GameState) => {
    log(
        "Scores",
        gameState.players
            .map((p: Player) => `${p.id}: ${getScore(p, gameState)}`)
            .join("\n"),
    )
    return gameState
}

const log = (title = "", message = "") =>
    console.log(
        `${
            title
                ? `${"-".repeat(title.length + 1)}\n${title}:\n${"-".repeat(
                      title.length + 1,
                  )}\n`
                : ""
        }${message}\n`,
    )

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

function main() {
    pipe(scores, take("player1", [1, 1], [1, 2]), scores)(initialState)
}

main()
