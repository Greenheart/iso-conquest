// Test with `deno run src/game/test.ts`

import type { GameState } from "./game"
import { loadMap, MAPS, newGame, getScore, Player } from "./game.ts"

const initialState = newGame(loadMap(MAPS["bonus"]))

const scores = (gameState: GameState) =>
    log(
        "Scores",
        gameState.players
            .map((p: Player) => `${p.id}: ${getScore(p, gameState)}`)
            .join("\n"),
    )

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

function main() {
    scores(initialState)
}

main()
