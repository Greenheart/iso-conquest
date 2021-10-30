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
    import { gameState, getAdjacentZones, playerColors } from "$lib/stores"

    // TODO: map players to in game colors, to show their zones
    // TODO: use these colors when displaying scores

    export let map: Map
    $gameState = newGame(loadMap(map))
    const allZones = getZoneLookup($gameState.zones)

    // Initalize and cache config for the zone fetcher
    $getAdjacentZones = getAdjacent(
        $gameState.zones[0].x,
        ($gameState.zones.at(-1) as ZoneType).x,
        allZones,
    )

    // IDEA: make player colors pick from a set of pre-selected player colors, depending on how many players there are in the game
    $playerColors = {
        player1: "bg-blue-700",
        player2: "bg-red-800",
    }
</script>

<!-- TODO: show player scores -->
<!-- TODO: Highlight the current player -->

<!-- TODO: implement endgame conditions -->
<!-- TODO: make it possible to restart - probably by resetting the map -->

<div class="my-16" />

<div
    class="grid grid-cols-8 grid-rows-8 aspect-square max-w-6xl w-[90vw] mx-auto select-none"
    style="contain: strict"
>
    {#each $gameState.zones as zone}
        <Zone {zone} />
    {/each}
</div>
