<script lang="ts" context="module">
    import type { Map } from '$game/game'
    import { loadMap, newGame, getPlayerScores, isGameOver } from '$game/game'
    import { makeMove } from '$game/ai/random'
    import { dev } from '$app/environment'

    import Zone from '$components/Zone.svelte'
    import Header from '$components/Header.svelte'
    import Modal from '$components/Modal.svelte'
    import Scores from '$components/Scores.svelte'
</script>

<script lang="ts">
    import {
        gameState,
        selectedZone,
        conquerable,
        conquerableBySacrifice,
        gameStateHistory,
        showEndGame,
        isAITurn,
    } from '$lib/stores'

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

    const nextAITurn = () => {
        console.log('ai turn')
        let { action, next } = makeMove($gameState)

        window.setTimeout(() => {
            $selectedZone = action.origin

            window.setTimeout(() => {
                $gameStateHistory = [...$gameStateHistory, [action, next]]
                $gameState = next
                $selectedZone = undefined

                if (
                    $isAITurn &&
                    !$showEndGame &&
                    // TODO: find out why the AI player isn't removed from players.
                    // It is added to endGame properly, but not removed from players
                    $gameState.players.some(
                        (p) => p.id === $gameState.currentPlayer,
                    )
                ) {
                    // TODO: BUG: if player has zones left, they are not removed if an AI player caused them to run out of actions
                    // seems like the endgame checks can't happen properly here.
                    nextAITurn()
                }
            }, 350)
        }, 350)
    }
    $: {
        console.log('turn')
        if ($isAITurn && !$showEndGame) {
            nextAITurn()
        }
    }
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
        class:pointer-events-none={$isAITurn || $showEndGame}
        style="contain: strict"
    >
        {#each $gameState.zones as zone (`${zone.x}${zone.y}`)}
            <Zone {zone} />
        {/each}
    </div>

    {#if $showEndGame}
        <Modal
            title="Game Over!"
            actions={[
                {
                    onClick: startNewGame,
                    label: 'New Game',
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
