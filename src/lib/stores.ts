import { derived, writable } from "svelte/store"

import type { Action, GameState, Zone } from "$game/game"
import { isAI, isGameOver } from "$game/game"

export const gameState = writable<GameState>()
export const gameStateHistory = writable<[Action | undefined, GameState][]>()

export const isAITurn = derived(
    gameState,
    (gameState) => gameState && isAI(gameState, gameState.currentPlayer),
)
export const showEndGame = derived(
    gameState,
    (gameState) => gameState && isGameOver(gameState),
)
export const selectedZone = writable<Zone | undefined>()
export const conquerable = writable<Zone[]>()
export const conquerableBySacrifice = writable<Zone[]>()
