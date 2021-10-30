<script lang="ts" context="module">
    import type { PlayerStats } from "$game/game"
</script>

<script lang="ts">
    import { scale } from "svelte/transition"
    import { playerColors, gameState } from "$lib/stores"
    export let playerStats: PlayerStats[]

    const getSize = (score: number) =>
        `transform: scale(${(100 + score) / 100});`

    const getShadow = (id: PlayerStats["id"]) =>
        $gameState.currentPlayer.id === id
            ? " box-shadow: 0 0 40px 2px #ffffff50;"
            : ""
</script>

<!-- IDEA: add transition when score increases to make it stand out -->
<div
    class="flex justify-around items-center text-white font-medium text-2xl h-28"
>
    {#each playerStats as { id, score }}
        <p
            style={getSize(score) + getShadow(id)}
            class={$playerColors[id] +
                " p-2 rounded-full w-12 h-12 place-items-center grid"}
            transition:scale
        >
            {score}
        </p>
    {/each}
</div>
