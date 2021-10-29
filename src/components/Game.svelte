<script lang="ts" context="module">
    import { loadMap, newGame, Map } from "$game/game"
</script>

<script lang="ts">
    import { gameState } from "$lib/stores"
    import Zone from "./Zone.svelte"

    export let map: Map
    $gameState = newGame(loadMap(map))
</script>

<!-- TODO: render every zone -->
<!-- TODO: clicking a zone should make it clear that it's selected -->
<!-- TODO: show player scores -->
<!-- TODO: Highlight the current player -->

<div class="my-16" />

<div
    class="grid grid-cols-8 grid-rows-8 aspect-square max-w-6xl w-[90vw] mx-auto select-none"
>
    {#each $gameState.zones as zone}
        <Zone {zone} />
    {/each}
</div>
