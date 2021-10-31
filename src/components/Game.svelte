<script lang="ts" context="module">
    import {
        loadMap,
        newGame,
        Map,
        getPlayerScores,
        isGameOver,
    } from "$game/game"

    import Zone from "./Zone.svelte"
    import Header from "./Header.svelte"
    import Modal from "./Modal.svelte"
    import Scores from "./Scores.svelte"
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
    } from "$lib/stores"

    export let map: Map

    const startNewGame = () => {
        $gameState = newGame(loadMap(map))
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []
    }

    startNewGame()

    $: showEndGame = isGameOver($gameState)
</script>

<!-- TODO: if endGame, show toplist with scores for players -->

<!-- IDEA: Whener a new player is added to the endGame array, show a toaster that the player was eliminated -->
<!-- IDEA: This toaster can later be used to show messages when players conquer many zones at once,
    to make the game feel more engaging and alive by hyping their actions
-->

{#if $gameState}
    <Header {startNewGame} />
    <Scores playerScores={getPlayerScores($gameState)} />

    <div class="grid place-items-center">
        <div
            class="grid grid-cols-8 grid-rows-8 aspect-square max-w-5xl w-full mx-auto select-none text-white"
            class:pointer-events-none={showEndGame}
            style="contain: strict"
        >
            {#each $gameState.zones as zone (`${zone.x}${zone.y}`)}
                <Zone {zone} />
            {/each}
        </div>

        {#if showEndGame}
            <Modal
                title="Game Over!"
                actions={[
                    {
                        onClick: startNewGame,
                        label: "New Game",
                        autofocus: true,
                    },
                ]}
            >
                <!-- IDEA: sort by turnsPlayed, and then sort by score -->
                <!-- IDEA: Show color badge with score (relative size just like in-game scores, and animation when it enters) -->
                <!-- IDEA: If player won: show "Winner!" -->
                <!-- IDEA: If player lost: show reason why, mapping the enum to a display string. -->
                <pre>
                    {JSON.stringify($gameState.endGame, null, 2)}
                </pre>
            </Modal>
        {/if}
    </div>
{/if}
