<script lang="ts" context="module">
    import type { PlayerScore } from "$game/game"
    import { getPlayerColor } from "$lib/utils"
</script>

<script lang="ts">
    import { scale } from "svelte/transition"
    import { gameState } from "$lib/stores"
    import { flip } from "svelte/animate"
    export let playerScores: PlayerScore[]

    const getSize = (score: number) =>
        `transform: scale(${(100 + score) / 100});`

    const getShadow = (id: PlayerScore["id"]) =>
        $gameState.currentPlayer === id
            ? " box-shadow: 0 0 40px 2px #ffffff50;"
            : ""
</script>

<!-- IDEA: add transition when score increases to make it stand out.
    Maybe it's possible to trigger a short animation that makes it look like it's bouncing up and down (increasing and decreasing in size) -->
<div
    class="flex justify-center space-x-10 items-center text-white font-medium text-2xl h-28"
>
    {#each playerScores as { id, score } (id)}
        <p
            style={getSize(score) + getShadow(id)}
            class={getPlayerColor(id) +
                " p-2 rounded-full w-12 h-12 place-items-center grid"}
            transition:scale
            animate:flip={{ duration: 300 }}
        >
            {score}
        </p>
    {/each}
</div>
