<script lang="ts" module>
    import Modal from '$components/Modal.svelte'
    import { dev } from '$app/environment'
</script>

<script lang="ts">
    import { gameStateHistory } from '$lib/stores'
    import { onKeydown } from '$lib/utils'
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
            <svg
                onkeydown={onKeydown(openConfirm)}
                onclick={openConfirm}
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
            {#if dev}
                <svg
                    onclick={logHistory}
                    onkeydown={onKeydown(logHistory)}
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            {/if}
        </div>

        <h1 class="-mt-2 text-4xl font-semibold">Iso Conquest</h1>
        <a
            href="https://github.com/Greenheart/iso-conquest"
            target="_blank"
            rel="noreferrer"
            aria-label="Check out the source code"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                class="h-6 w-6"
                fill="#fff"
            >
                <path
                    fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
            </svg>
        </a>
    </div>
</header>
