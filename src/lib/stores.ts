import { writable } from "svelte/store"

import type { Action, GameState, Zone } from "$game/game"

export const gameState = writable<GameState>()
export const gameStateHistory = writable<[Action | undefined, GameState][]>()

export const selectedZone = writable<Zone | undefined>()
export const conquerable = writable<Zone[]>()
export const conquerableBySacrifice = writable<Zone[]>()
