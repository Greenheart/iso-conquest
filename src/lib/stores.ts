import { writable } from "svelte/store"

import type { GameState, Zone, getAdjacent, Player } from "$game/game"

export const gameState = writable<GameState>()
export const getAdjacentZones = writable<ReturnType<typeof getAdjacent>>()
export const playerColors = writable<Record<Player["id"], string>>()

export const selectedZone = writable<Zone | undefined>()
export const conquerable = writable<Zone[]>()
export const conquerableBySacrifice = writable<Zone[]>()
