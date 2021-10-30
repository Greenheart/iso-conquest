<script lang="ts" context="module">
    import {
        Zone,
        isSame,
        conquer,
        conquerBySacrifice,
        getConquerableNeighbors,
        getAdjacentZones,
    } from "$game/game"
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
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

    // IDEA: Maybe cache all adjacent zones for each zone to make runtime checks faster
    // Will especially be useful when adding minimax AI

    function getBgColor() {
        if (zone.owner && $playerColors) return $playerColors[zone.owner.id]
        if (isConquerable) return "bg-teal-500"
        if (isConquerableBySacrifice) return "bg-teal-700"
        return "bg-teal-800"
    }

    function reset() {
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []
    }

    function handleClick() {
        if (isOwnZone && getConquerableNeighbors($gameState, zone).length) {
            $selectedZone = zone
            $conquerable = getAdjacentZones($gameState, zone, 1).filter(
                (z) => !z.owner,
            )
            $conquerableBySacrifice = getAdjacentZones(
                $gameState,
                zone,
                2,
            ).filter((z) => !z.owner)
            return
        }

        const action = {
            player: $gameState.currentPlayer,
            origin: $selectedZone as Zone,
            target: zone,
        }

        if (isConquerable) {
            $gameState = conquer($gameState, action)
        } else if (isConquerableBySacrifice) {
            $gameState = conquerBySacrifice($gameState, action)
        }

        if ($selectedZone) reset()
    }
</script>

<div
    class={"grid place-items-center border-2 border-transparent relative" +
        ` ${getBgColor()}` +
        `${
            isConquerable ||
            isConquerableBySacrifice ||
            // (isOwnZone && getConquerableNeighbors($gameState, zone).length) ||
            $selectedZone === zone
                ? " hover:border-white"
                : ""
        }`}
    on:click={handleClick}
>
    <p
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
        {zone.type !== "default" ? zone.value : ""}
    </p>
</div>
