import type { PlayerId } from "$game/game"

type PlayerColor = {
    default: string
    border: string
    active: string
}

// NOTE: These colors didn't work as well as hoped. Might remove it later.
const playerColors: Record<PlayerId, PlayerColor> = {
    player1: {
        default: "bg-sky-900",
        border: "border-sky-900",
        active: "bg-sky-800",
    },
    player2: {
        default: "bg-amber-900",
        border: "border-amber-900",
        active: "bg-amber-800",
    },
    player3: {
        default: "bg-yellow-500",
        border: "border-yellow-500",
        active: "bg-yellow-400",
    },
}

export const getPlayerColor = (
    id: PlayerId,
    variant: keyof PlayerColor = "default",
) => playerColors[id][variant]
