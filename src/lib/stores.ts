import { writable } from "svelte/store"

import type { GameState, Zone, Player } from "$game/game"

export const gameState = writable<GameState>()
export const playerColors = writable<Record<Player["id"], string>>()

export const selectedZone = writable<Zone | undefined>()
export const conquerable = writable<Zone[]>()
export const conquerableBySacrifice = writable<Zone[]>()
