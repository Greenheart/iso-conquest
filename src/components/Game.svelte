<script lang="ts" context="module">
    import { loadMap, newGame, Map, EndGameReason } from "$game/game"

    import Zone from "./Zone.svelte"
</script>

<script lang="ts">
    import { gameState, playerColors } from "$lib/stores"
    import Modal from "./Modal.svelte"

    // TODO: map players to in game colors, to show their zones
    // TODO: use these colors when displaying scores

    export let map: Map
    $gameState = {
        ...newGame(loadMap(map)),
        endGame: {
            winners: [
                {
                    id: "player1",
                    score: 62,
                },
            ],
            reason: EndGameReason.NoActions,
        },
    }

    // IDEA: make player colors pick from a set of pre-selected player colors, depending on how many players there are in the game
    $playerColors = {
        player1: "bg-sky-900",
        player2: "bg-amber-900",
    }
</script>

<!-- TODO: show player scores -->
<!-- TODO: Highlight the current player -->

<!-- TODO: implement endgame conditions -->
<!-- TODO: make it possible to restart - probably by resetting the map -->

<!-- TODO: if endGame is set, show toplist with scores for players, and a restart button -->

<div class="mt-16 grid place-items-center">
    <div
        class="grid grid-cols-8 grid-rows-8 aspect-square max-w-6xl w-[90vw] mx-auto select-none"
        class:pointer-events-none={$gameState.endGame}
        style="contain: strict"
    >
        {#each $gameState.zones as zone (`${zone.x}${zone.y}`)}
            <Zone {zone} />
        {/each}
    </div>

    {#if $gameState.endGame}
        <Modal class="bg-stone-700 p-8 max-w-md w-full">
            <!-- IDEA: add nice transition when the scores enters the screen -->
            <h2 slot="header" class="font-semibold text-2xl text-center">
                Game Over!
            </h2>
            <div class="my-8">
                <pre>
                    {JSON.stringify($gameState.endGame, null, 2)}
                </pre>
            </div>
            <div slot="footer" class="flex justify-center">
                <!-- svelte-ignore a11y-autofocus -->
                <button
                    class="px-12 py-4 bg-emerald-500 text-white hover:transform-gpu hover:scale-105 duration-100 text-xl font-semibold"
                    autofocus
                    on:click={() => {
                        $gameState = newGame(loadMap(map))
                    }}>New Game</button
                >
            </div>
        </Modal>
    {/if}
</div>
