<script lang="ts" context="module">
    import type { PlayerStats } from "$game/game"
</script>

<script lang="ts">
    import { playerColors } from "$lib/stores"
    export let playerStats: PlayerStats[]
</script>

<!-- IDEA: when score increases, increase the size, then decrease when player lose score -->
<div class="flex justify-around my-8">
    {#each playerStats as { id, score }}
        <p
            class={$playerColors[id] +
                " p-2 rounded-full w-16 h-16 place-items-center grid"}
        >
            {score}
        </p>
    {/each}
</div>
