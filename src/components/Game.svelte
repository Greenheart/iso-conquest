<script lang="ts" context="module">
    import {
        loadMap,
        newGame,
        Map,
        getAdjacent,
        getZoneLookup,
        Zone as ZoneType,
    } from "$game/game"

    import Zone from "./Zone.svelte"
</script>

<script lang="ts">
    import { gameState, getAdjacentZones } from "$lib/stores"

    export let map: Map
    $gameState = newGame(loadMap(map))
    const allZones = getZoneLookup($gameState.zones)

    // Initalize and cache config for the zone fetcher
    $getAdjacentZones = getAdjacent(
        $gameState.zones[0].x,
        ($gameState.zones.at(-1) as ZoneType).x,
        allZones,
    )
</script>

<!-- TODO: show player scores -->
<!-- TODO: Highlight the current player -->

<!-- TODO: implement endgame conditions -->
<!-- TODO: make it possible to restart - probably by resetting the map -->

<div class="my-16" />

<div
    class="grid grid-cols-8 grid-rows-8 aspect-square max-w-6xl w-[90vw] mx-auto select-none"
>
    {#each $gameState.zones as zone}
        <Zone {zone} />
    {/each}
</div>
