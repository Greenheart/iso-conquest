<script lang="ts" module>
    import type { Snippet } from 'svelte'
    import Modal from '$components/BaseModal.svelte'
    import Button from '$components/Button.svelte'
    import type { ButtonProps } from '$components/Button.svelte'
</script>

<script lang="ts">
    interface Props {
        title: string
        actions: ButtonProps[] // IDEA: Optionally enable closing with ESC or by clicking outside. Control with prop
        children?: Snippet
    }

    let { title, actions, children }: Props = $props()
</script>

<Modal class="w-full max-w-md bg-stone-700 p-8">
    {#snippet header()}
        <h2 class="text-center text-2xl font-semibold">
            {title}
        </h2>
    {/snippet}
    <div class="my-8">
        {@render children?.()}
    </div>
    {#snippet footer()}
        <div class="flex flex-col justify-center space-y-2">
            {#each actions as { onclick, variant, label, autofocus }}
                <Button {label} {onclick} {variant} {autofocus} />
            {/each}
        </div>
    {/snippet}
</Modal>
