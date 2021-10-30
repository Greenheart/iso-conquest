<script lang="ts">
    import { scale } from "svelte/transition"
    let modal: HTMLDivElement

    const classes = [
        $$props.class ?? "",
        "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl bg-stone-700",
    ].join(" ")
</script>

<div
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 pointer-events-none"
/>

<div class={classes} role="dialog" aria-modal="true" bind:this={modal} in:scale>
    <slot name="header" />
    <slot />
    <slot name="footer" />
</div>
