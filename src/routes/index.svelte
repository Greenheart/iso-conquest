<script lang="ts">
    import Game from "$components/Game.svelte"
    import { MAPS } from "$game/game"
</script>

<!-- TODO: Create basic menu to select what map to play -->

<Game map={MAPS["neutralization"]} />
