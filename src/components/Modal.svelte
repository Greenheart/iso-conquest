<script lang="ts" context="module">
    import Modal from '$components/BaseModal.svelte'
    import Button from '$components/Button.svelte'
    import type { ButtonProps } from '$components/Button.svelte'
</script>

<script lang="ts">
    export let title: string
    export let actions: ButtonProps[]
    // IDEA: Optionally enable closing with ESC or by clicking outside. Control with prop
</script>

<Modal class="w-full max-w-md bg-stone-700 p-8">
    <h2 slot="header" class="text-center text-2xl font-semibold">
        {title}
    </h2>
    <div class="my-8">
        <slot />
    </div>
    <div slot="footer" class="flex flex-col justify-center space-y-2">
        {#each actions as { onClick, variant, label, autofocus }}
            <Button {label} {onClick} {variant} {autofocus} />
        {/each}
    </div>
</Modal>
