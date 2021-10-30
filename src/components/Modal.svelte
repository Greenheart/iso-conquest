<script lang="ts" context="module">
    import Modal from "$components/BaseModal.svelte"

    interface ModalAction {
        onClick: () => void
        label: string
    }
</script>

<script lang="ts">
    export let title: string
    export let actions: ModalAction[]
</script>

<Modal class="bg-stone-700 p-8 max-w-md w-full">
    <h2 slot="header" class="font-semibold text-2xl text-center">
        {title}
    </h2>
    <div class="my-8">
        <slot />
    </div>
    <div slot="footer" class="flex justify-center flex-col">
        <!-- svelte-ignore a11y-autofocus -->
        {#each actions as { onClick, label }}
            <button
                class="px-12 py-4 bg-emerald-500 text-white hover:transform-gpu hover:scale-105 duration-100 text-xl font-semibold"
                autofocus
                on:click={onClick}>{label}</button
            >
        {/each}
    </div>
</Modal>
