<script lang="ts" context="module">
    import { Zone, isSame, conquer } from "$game/game"
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
        getAdjacentZones,
    } from "$lib/stores"

    export let zone: Zone

    $: isConquerable =
        $selectedZone &&
        $selectedZone !== zone &&
        $conquerable.some((z) => isSame(z, zone))

    $: isConquerableBySacrifice =
        $selectedZone &&
        $selectedZone !== zone &&
        $conquerableBySacrifice.some((z) => isSame(z, zone))

    function reset() {
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []
    }

    function handleClick() {
        if (zone.owner === $gameState.currentPlayer) {
            $selectedZone = zone
            $conquerable = $getAdjacentZones(zone, 1)
            $conquerableBySacrifice = $getAdjacentZones(zone, 2)
        } else if (isConquerable) {
            $gameState = conquer($gameState, {
                player: $gameState.currentPlayer,
                origin: $selectedZone as Zone,
                target: zone,
            })

            reset()
        } else {
            reset()
        }
    }
</script>

<div
    class:shadow-xl={zone.type !== "default"}
    class="grid place-items-center bg-teal-900 border-2 border-transparent hover:border-emerald-500"
    class:bg-teal-200={$selectedZone === zone}
    class:bg-teal-500={isConquerable}
    class:bg-teal-700={isConquerableBySacrifice}
    on:click={handleClick}
>
    {zone.owner ? zone.owner.id : ""}
</div>
