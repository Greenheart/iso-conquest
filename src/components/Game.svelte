<script lang="ts" context="module">
    import { loadMap, newGame, Map, getPlayerStats } from "$game/game"

    import Zone from "./Zone.svelte"
    import Header from "./Header.svelte"
    import Modal from "./Modal.svelte"
    import Scores from "./Scores.svelte"
</script>

<script lang="ts">
    import { gameState, playerColors } from "$lib/stores"

    export let map: Map

    const startNewGame = () => {
        $gameState = newGame(loadMap(map))
    }

    startNewGame()

    // IDEA: make player colors pick from a set of pre-selected player colors, depending on how many players there are in the game
    $playerColors = {
        player1: "bg-sky-900",
        player2: "bg-amber-900",
    }
</script>

<!-- TODO: if endGame, show toplist with scores for players -->

{#if $gameState}
    <Header {startNewGame} />
    <Scores playerStats={getPlayerStats($gameState)} />

    <div class="grid place-items-center">
        <div
            class="grid grid-cols-8 grid-rows-8 aspect-square max-w-6xl w-full mx-auto select-none text-white"
            class:pointer-events-none={$gameState.endGame}
            style="contain: strict"
        >
            {#each $gameState.zones as zone (`${zone.x}${zone.y}`)}
                <Zone {zone} />
            {/each}
        </div>

        {#if $gameState.endGame}
            <Modal
                title="Game Over!"
                actions={[{ onClick: startNewGame, label: "New Game" }]}
            >
                <pre>
                    {JSON.stringify($gameState.endGame, null, 2)}
                </pre>
            </Modal>
        {/if}
    </div>
{/if}
