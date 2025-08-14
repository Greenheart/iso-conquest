<script lang="ts" module>
    import type { Zone } from '$game/game'
    import {
        isSame,
        conquer,
        conquerBySacrifice,
        getConquerableNeighbors,
        hasConquerableNeighbors,
    } from '$game/game'
    import { cn, getPlayerColor } from '$lib/utils'
    import { dev } from '$app/environment'
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
        gameStateHistory,
    } from '$lib/stores'

    interface Props {
        zone: Zone
    }

    let { zone }: Props = $props()

    let isOwnZone = $derived(zone.owner === $gameState.currentPlayer)

    let isConquerable = $derived(
        $selectedZone &&
            $selectedZone !== zone &&
            $conquerable.some((z) => isSame(zone, z)),
    )

    let isConquerableBySacrifice = $derived(
        $selectedZone &&
            $selectedZone !== zone &&
            $conquerableBySacrifice.some((z) => isSame(zone, z)),
    )

    // IDEA: Maybe cache all adjacent zones for each zone to make runtime checks faster
    // Will especially be useful when adding minimax AI
    // IDEA: Maybe enable minimax as a cheat, to help players learn the game and see the best moves.

    function getBgColor() {
        if ($selectedZone === zone) return 'bg-white'
        if (zone.owner) return getPlayerColor(zone.owner)
        if (isConquerable) return 'bg-teal-500'
        if (isConquerableBySacrifice) return 'bg-teal-700'
        return 'bg-teal-800'
    }

    function getBorderColor() {
        if ($selectedZone === zone) return 'border-white'
        if (zone.owner) return getPlayerColor(zone.owner, 'border')
        if (isConquerable) return 'border-teal-500'
        if (isConquerableBySacrifice) return 'border-teal-700'
        return 'border-teal-800'
    }

    function reset() {
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []
    }

    function handleClick(event: MouseEvent) {
        if (!event.isTrusted) return false
        const conquerableNeighbors = isOwnZone
            ? {
                  1: getConquerableNeighbors($gameState, zone, 1),
                  2: getConquerableNeighbors($gameState, zone, 2),
              }
            : undefined

        if (
            conquerableNeighbors &&
            (conquerableNeighbors[1].length || conquerableNeighbors[2].length)
        ) {
            $selectedZone = zone
            $conquerable = conquerableNeighbors[1]
            $conquerableBySacrifice = conquerableNeighbors[2]
            return
        }

        const action = {
            playerId: $gameState.currentPlayer,
            origin: $selectedZone as Zone,
            target: zone,
        }

        if (isConquerable) {
            if (dev) {
                const next = conquer($gameState, action)
                $gameStateHistory = [...$gameStateHistory, [action, next]]
                $gameState = next
            } else {
                $gameState = conquer($gameState, action)
            }
        } else if (isConquerableBySacrifice) {
            if (dev) {
                const next = conquerBySacrifice($gameState, action)
                $gameStateHistory = [...$gameStateHistory, [action, next]]
                $gameState = next
            } else {
                $gameState = conquerBySacrifice($gameState, action)
            }
        }

        if ($selectedZone) reset()
    }
</script>

<button
    class={cn([
        'relative grid place-items-center border',
        getBgColor(),
        getBorderColor(),
        isConquerable ||
        isConquerableBySacrifice ||
        (isOwnZone && hasConquerableNeighbors($gameState, zone))
            ? 'hover:rounded-xl hover:border-white'
            : '',
        isOwnZone && hasConquerableNeighbors($gameState, zone)
            ? 'cursor-pointer rounded-xl '
            : '',
    ])}
    onclick={handleClick}
>
    <p
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu text-xl"
    >
        {zone.type !== 'default' ? zone.value : ''}
    </p>
</button>
