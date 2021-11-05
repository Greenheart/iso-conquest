<script lang="ts" context="module">
    import {
        loadMap,
        newGame,
        Map,
        getPlayerScores,
        isGameOver,
    } from "$game/game"
    import { dev } from "$app/env"

    import Zone from "$components/Zone.svelte"
    import Header from "$components/Header.svelte"
    import Modal from "$components/Modal.svelte"
    import Scores from "$components/Scores.svelte"
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
        gameStateHistory,
    } from "$lib/stores"

    export let map: Map

    const startNewGame = () => {
        $selectedZone = undefined
        $conquerable = []
        $conquerableBySacrifice = []

        if (dev) {
            const next = newGame(loadMap(map))
            $gameStateHistory = [[undefined, next]]
            $gameState = next
        } else {
            $gameState = newGame(loadMap(map))
        }
    }

    startNewGame()

    $: showEndGame = isGameOver($gameState)
</script>

<!-- TODO: if endGame, show toplist with scores for players -->

<!-- IDEA: Whener a new player is added to the endGame array, show a toaster that the player was eliminated -->
<!-- IDEA: This toaster can later be used to show messages when players conquer many zones at once,
    to make the game feel more engaging and alive by hyping their actions

    for example, conquering 7 zones might show "Legendary!" or something similar, with an increasing scale for conquering 6,7 or 8 zones.
-->

<!-- IDEA: Save statistics for players in localStorage after each game.
    - number of zones conquered
    - number of zones conqueredBySacrifice
    - number of neutral zones conquered
    - number of zones conquered from opponents
    - number of zones lost to opponents
    - games won
    - games played
    - average score
    - total score
    - endGame stats from all played games
-->

<!-- IDEA: Add background music -->
<!-- IDEA: Add sound effects
    - conquering a zone (or more)
    - opponent conquers your zone
    - announcer sounds ("Legendary!" and similar)
-->

{#if $gameState}
    <Header {startNewGame} />
    <Scores
        playerScores={isGameOver($gameState)
            ? $gameState.endGame.sort(
                  (a, b) => Number(a.id.slice(-1)) - Number(b.id.slice(-1)),
              )
            : getPlayerScores($gameState)}
    />
    <div
        class="grid grid-cols-8 grid-rows-8 max-w-4xl w-full max-h-[calc(100vh-176px)] aspect-square mx-auto select-none text-white bg-white"
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
{/if}
