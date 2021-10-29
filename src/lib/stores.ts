import { writable } from "svelte/store"

import type { GameState, Zone, getAdjacent } from "$game/game"

export const gameState = writable<GameState>()
export const getAdjacentZones = writable<ReturnType<typeof getAdjacent>>()

export const selectedZone = writable<Zone | undefined>()
export const conquerable = writable<Zone[]>()
export const conquerableBySacrifice = writable<Zone[]>()
