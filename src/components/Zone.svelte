<script lang="ts" context="module">
    import {
        Zone,
        isSame,
        conquer,
        conquerBySacrifice,
        getConquerableNeighbors,
        hasConquerableNeighbors,
    } from "$game/game"
    import { getPlayerColor } from "$lib/utils"
    import { dev } from "$app/env"
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
        gameStateHistory,
    } from "$lib/stores"

    export let zone: Zone

    $: isOwnZone = zone.owner === $gameState.currentPlayer

    $: isConquerable =
        $selectedZone &&
        $selectedZone !== zone &&
        $conquerable.some((z) => isSame(zone, z))

    $: isConquerableBySacrifice =
        $selectedZone &&
        $selectedZone !== zone &&
        $conquerableBySacrifice.some((z) => isSame(zone, z))

    // IDEA: Maybe cache all adjacent zones for each zone to make runtime checks faster
    // Will especially be useful when adding minimax AI
    // IDEA: Maybe enable minimax as a cheat, to help players learn the game and see the best moves.

    function getBgColor() {
        if (zone.owner) return getPlayerColor(zone.owner)
        if (isConquerable) return "bg-teal-500"
        if (isConquerableBySacrifice) return "bg-teal-700"
        return "bg-teal-800"
    }

    function getBorderColor() {
        if (zone.owner) return getPlayerColor(zone.owner, "border")
        if (isConquerable) return "border-teal-500"
        if (isConquerableBySacrifice) return "border-teal-700"
        return "border-teal-800"
    }

    function reset() {
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []
    }

    function handleClick() {
        const conquerableNeighbors = isOwnZone
            ? getConquerableNeighbors($gameState, zone)
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

<div
    class={"grid place-items-center relative border" +
        ` ${getBgColor()} ${getBorderColor()} ${
            isOwnZone && hasConquerableNeighbors($gameState, zone)
                ? "rounded-xl cursor-pointer "
                : ""
        }` +
        ` ${
            isConquerable ||
            isConquerableBySacrifice ||
            (isOwnZone && hasConquerableNeighbors($gameState, zone))
                ? "hover:border-white hover:rounded-xl cursor-pointer"
                : ""
        }`}
    class:border-white={$selectedZone === zone}
    on:click|trusted={handleClick}
>
    <p
        class="absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 text-xl"
    >
        {zone.type !== "default" ? zone.value : ""}
    </p>
</div>
