<script lang="ts" context="module">
    import { loadMap, newGame, Map } from "$game/game"
</script>

<script lang="ts">
    import { gameState } from "$lib/stores"

    export let map: Map
    $gameState = newGame(loadMap(map))
</script>

<pre>{JSON.stringify($gameState, null, 2)}</pre>
