import { writable } from "svelte/store"

import type { GameState } from "$game/game"

export const gameState = writable<GameState>()
