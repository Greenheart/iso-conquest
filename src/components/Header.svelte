<script lang="ts" module>
    import Modal from '$components/Modal.svelte'
    import { dev } from '$app/environment'
</script>

<script lang="ts">
    import { gameStateHistory } from '$lib/stores'
    import { onKeydown } from '$lib/utils'
    import LucideFileDown from '~icons/lucide/file-down'
    import LucideRefreshCw from '~icons/lucide/refresh-cw'
    import MdiGithub from '~icons/mdi/github'

    interface Props {
        startNewGame: () => void
    }

    let { startNewGame }: Props = $props()
    let showConfirm = $state(false)

    const openConfirm = () => {
        showConfirm = true
    }

    const logHistory = () => {
        console.log('🐞', $gameStateHistory)
    }
</script>

{#if showConfirm}
    <Modal
        title="Are you sure you want to restart?"
        actions={[
            {
                onclick: () => {
                    startNewGame()
                    showConfirm = false
                },
                label: 'Restart',
                variant: 'danger',
            },
            {
                onclick: () => {
                    showConfirm = false
                },
                label: 'Cancel',
                variant: 'secondary',
                autofocus: true,
            },
        ]}
    />
{/if}

<!-- IDEA: Allow players to adjust AI speed between 200 ms to 2000 ms per step -->

<header class="bg-stone-800 shadow-lg">
    <div class="mx-auto flex w-full max-w-4xl items-center justify-between p-4">
        <div class="flex items-center space-x-2 text-white">
            <LucideRefreshCw
                class="size-6 cursor-pointer"
                onkeydown={onKeydown(openConfirm)}
                onclick={openConfirm}
            />
            {#if dev}
                <LucideFileDown
                    class="size-6 cursor-pointer"
                    onclick={logHistory}
                    onkeydown={onKeydown(logHistory)}
                />
            {/if}
        </div>

        <h1 class="-mt-2 text-4xl font-semibold">Iso Conquest</h1>
        <a
            href="https://github.com/Greenheart/iso-conquest"
            target="_blank"
            rel="noreferrer"
            aria-label="Check out the source code"
        >
            <MdiGithub class="size-6 text-white" />
        </a>
    </div>
</header>
