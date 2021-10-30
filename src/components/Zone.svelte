<script lang="ts" context="module">
    import { Zone, isSame, conquer, conquerBySacrifice } from "$game/game"
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
        getAdjacentZones,
        playerColors,
    } from "$lib/stores"

    export let zone: Zone

    $: isOwnZone = zone.owner === $gameState.currentPlayer

    $: isConquerable =
        $selectedZone &&
        $selectedZone !== zone &&
        $conquerable.some((z) => isSame(z, zone))

    $: isConquerableBySacrifice =
        $selectedZone &&
        $selectedZone !== zone &&
        $conquerableBySacrifice.some((z) => isSame(z, zone))

    function getBgColor() {
        if (zone.owner && $playerColors) return $playerColors[zone.owner.id]
        if (isConquerable) return "bg-teal-500"
        if (isConquerableBySacrifice) return "bg-teal-700"
        return "bg-teal-900"
    }

    function reset() {
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []
    }

    function handleClick() {
        if (isOwnZone) {
            $selectedZone = zone
            $conquerable = $getAdjacentZones(zone, 1)
            $conquerableBySacrifice = $getAdjacentZones(zone, 2)
            return
        }

        if (isConquerable) {
            $gameState = conquer($gameState, {
                player: $gameState.currentPlayer,
                origin: $selectedZone as Zone,
                target: zone,
            })
        } else if (isConquerableBySacrifice) {
            $gameState = conquerBySacrifice($gameState, {
                player: $gameState.currentPlayer,
                origin: $selectedZone as Zone,
                target: zone,
            })
        }

        reset()
    }
</script>

<!-- TODO: make only hoverable when you can select the zone, otherwise let the zone be -->
<!-- See original game for UI ideas -->

<div
    class:shadow-xl={zone.type !== "default"}
    class={"grid place-items-center border-2 border-transparent" +
        ` ${getBgColor()}` +
        `${
            isConquerable ||
            isConquerableBySacrifice ||
            isOwnZone ||
            $selectedZone === zone
                ? " hover:border-white"
                : ""
        }`}
    on:click={handleClick}
/>
