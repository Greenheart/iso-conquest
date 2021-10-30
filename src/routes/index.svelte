<script lang="ts">
    import Game from "$components/Game.svelte"
    import { MAPS } from "$game/game"
</script>

<Game map={MAPS["debug"]} />
