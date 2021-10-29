<script lang="ts" context="module">
    import type { Zone } from "$game/game"
</script>

<script lang="ts">
    import { gameState } from "$lib/stores"

    export let zone: Zone
</script>

<div
    class:shadow-xl={zone.type !== "default"}
    class="grid place-items-center bg-teal-900 border-2 border-transparent hover:border-emerald-500"
>
    {zone.owner ? zone.owner.id : ""}
</div>
