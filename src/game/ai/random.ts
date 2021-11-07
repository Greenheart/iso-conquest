// IDEA: for more advanced AI, we could try sorting the actions based on which would yield the best outcome

import { conquer, conquerBySacrifice, getAvailableActions } from "$game/game"
import type { GameState, Player } from "$game/game"
import { randomInt } from "$lib/utils"

export const makeMove = (gameState: GameState) => {
    const available = getAvailableActions(
        gameState,
        gameState.players.find(
            (p) => p.id === gameState.currentPlayer,
        ) as Player,
    )

    console.log("🤖", gameState.currentPlayer, available)

    const all = [...available.conquer, ...available.conquerBySacrifice]
    const action = all[randomInt(0, all.length - 1)]

    if (available.conquer.some((a) => a === action)) {
        return { action, next: conquer(gameState, action) }
    } else {
        return { action, next: conquerBySacrifice(gameState, action) }
    }
}
