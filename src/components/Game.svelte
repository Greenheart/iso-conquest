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
<!-- IDEA: Add soung effects
    - conquering a zone (or more)
    - opponent conquers your zone
    - announcer sounds ("Legendary!" and similar)
-->

{#if $gameState}
    <Header {startNewGame} />
    <Scores playerScores={getPlayerScores($gameState)} />
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

<!--

TODO: fix bug where zones that just got neutralized after their owner had no available actions prevented other players from taking them in the turn right after neutralization
Debugged and verified that the previous owner still owns the zones, as if they didn't lose access to them.
However, they are removed from the players array and don't have either scores or are shown with zone color.


NOTE: Here's a dump with the history for a session, with initial state, and most importantly, all actual [Action, GameState] that were used and returned.
This makes it possible to recreate the state and debug it.
Maybe even write automated tests

[
  [
    null,
    {
      "turn": 1,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player2"
        },
        {
          "id": "player3"
        }
      ],
      "currentPlayer": "player1",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": []
    }
  ],
  [
    {
      "playerId": "player1",
      "origin": {
        "x": 4,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "target": {
        "x": 3,
        "y": 3,
        "type": "default",
        "value": 1
      }
    },
    {
      "turn": 2,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player3"
        },
        {
          "id": "player2"
        }
      ],
      "currentPlayer": "player2",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": []
    }
  ],
  [
    {
      "playerId": "player2",
      "origin": {
        "x": 2,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "target": {
        "x": 1,
        "y": 6,
        "type": "default",
        "value": 1
      }
    },
    {
      "turn": 3,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player3"
        },
        {
          "id": "player2"
        }
      ],
      "currentPlayer": "player1",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": []
    }
  ],
  [
    {
      "playerId": "player1",
      "origin": {
        "x": 3,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "target": {
        "x": 2,
        "y": 4,
        "type": "default",
        "value": 1
      }
    },
    {
      "turn": 4,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player3"
        },
        {
          "id": "player2"
        }
      ],
      "currentPlayer": "player3",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": []
    }
  ],
  [
    {
      "playerId": "player3",
      "origin": {
        "x": 4,
        "y": 7,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "target": {
        "x": 3,
        "y": 8,
        "type": "default",
        "value": 1
      }
    },
    {
      "turn": 5,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player3"
        },
        {
          "id": "player2"
        }
      ],
      "currentPlayer": "player2",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": []
    }
  ],
  [
    {
      "playerId": "player2",
      "origin": {
        "x": 2,
        "y": 6,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "target": {
        "x": 1,
        "y": 5,
        "type": "default",
        "value": 1
      }
    },
    {
      "turn": 6,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player3"
        },
        {
          "id": "player2"
        }
      ],
      "currentPlayer": "player1",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": []
    }
  ],
  [
    {
      "playerId": "player1",
      "origin": {
        "x": 3,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "target": {
        "x": 2,
        "y": 3,
        "type": "default",
        "value": 1
      }
    },
    {
      "turn": 7,
      "zones": [
        {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 1,
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 6,
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 7,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 7,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 7,
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 7,
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 2,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 3,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 4,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 5,
          "y": 8,
          "type": "default",
          "value": 1
        },
        {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      ],
      "players": [
        {
          "id": "player1"
        },
        {
          "id": "player2"
        }
      ],
      "currentPlayer": "player2",
      "zoneLookup": {
        "11": {
          "x": 1,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "12": {
          "x": 1,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "13": {
          "x": 1,
          "y": 3,
          "type": "default",
          "value": 1
        },
        "14": {
          "x": 1,
          "y": 4,
          "type": "default",
          "value": 1
        },
        "15": {
          "x": 1,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "16": {
          "x": 1,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "17": {
          "x": 1,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "18": {
          "x": 1,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "21": {
          "x": 2,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "22": {
          "x": 2,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "23": {
          "x": 2,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "24": {
          "x": 2,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "25": {
          "x": 2,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "26": {
          "x": 2,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "27": {
          "x": 2,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "28": {
          "x": 2,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "31": {
          "x": 3,
          "y": 1,
          "type": "default",
          "value": 1
        },
        "32": {
          "x": 3,
          "y": 2,
          "type": "default",
          "value": 1
        },
        "33": {
          "x": 3,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "34": {
          "x": 3,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "35": {
          "x": 3,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "36": {
          "x": 3,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "37": {
          "x": 3,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "38": {
          "x": 3,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "41": {
          "x": 4,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "42": {
          "x": 4,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "43": {
          "x": 4,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "44": {
          "x": 4,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "45": {
          "x": 4,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "46": {
          "x": 4,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "47": {
          "x": 4,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "48": {
          "x": 4,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "51": {
          "x": 5,
          "y": 1,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "52": {
          "x": 5,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "53": {
          "x": 5,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "54": {
          "x": 5,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "55": {
          "x": 5,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "56": {
          "x": 5,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "57": {
          "x": 5,
          "y": 7,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "58": {
          "x": 5,
          "y": 8,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "61": {
          "x": 6,
          "y": 1,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "62": {
          "x": 6,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "63": {
          "x": 6,
          "y": 3,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "64": {
          "x": 6,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "65": {
          "x": 6,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "66": {
          "x": 6,
          "y": 6,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "67": {
          "x": 6,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "68": {
          "x": 6,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "71": {
          "x": 7,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "72": {
          "x": 7,
          "y": 2,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "73": {
          "x": 7,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "74": {
          "x": 7,
          "y": 4,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "75": {
          "x": 7,
          "y": 5,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "76": {
          "x": 7,
          "y": 6,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "77": {
          "x": 7,
          "y": 7,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "78": {
          "x": 7,
          "y": 8,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "81": {
          "x": 8,
          "y": 1,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "82": {
          "x": 8,
          "y": 2,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "83": {
          "x": 8,
          "y": 3,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "84": {
          "x": 8,
          "y": 4,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "85": {
          "x": 8,
          "y": 5,
          "owner": "player2",
          "type": "default",
          "value": 1
        },
        "86": {
          "x": 8,
          "y": 6,
          "owner": "player3",
          "type": "default",
          "value": 1
        },
        "87": {
          "x": 8,
          "y": 7,
          "owner": "player1",
          "type": "default",
          "value": 1
        },
        "88": {
          "x": 8,
          "y": 8,
          "owner": "player1",
          "type": "default",
          "value": 1
        }
      },
      "boundaries": [
        1,
        8
      ],
      "endGame": [
        {
          "id": "player3",
          "score": 0,
          "reason": "no-actions",
          "turnsPlayed": 7
        }
      ]
    }
  ]
]


NOTE: Here's a dump of the gameState after the bug occurred, but not the exact action and game state that led up to it. 


$gameState = {
    "turn": 57,
    "zones": [
      {
        "x": 1,
        "y": 1,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 1,
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 1,
        "type": "default",
        "value": 1
      },
      {
        "x": 4,
        "y": 1,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 1,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 1,
        "type": "default",
        "value": 1
      },
      {
        "x": 7,
        "y": 1,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 1,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 2,
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 2,
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 4,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 7,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 2,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 3,
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 3,
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 3,
        "type": "bonus",
        "value": 5
      },
      {
        "x": 4,
        "y": 3,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 3,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 3,
        "owner": "player1",
        "type": "bonus",
        "value": 5
      },
      {
        "x": 7,
        "y": 3,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 3,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 4,
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 4,
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 4,
        "y": 4,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 7,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 4,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 5,
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 5,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 5,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 4,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 7,
        "y": 5,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 6,
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 6,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 6,
        "owner": "player1",
        "type": "bonus",
        "value": 5
      },
      {
        "x": 4,
        "y": 6,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 6,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 6,
        "owner": "player2",
        "type": "bonus",
        "value": 5
      },
      {
        "x": 7,
        "y": 6,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 6,
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 7,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 7,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 4,
        "y": 7,
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 7,
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 7,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 7,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 1,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 2,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 3,
        "y": 8,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 4,
        "y": 8,
        "type": "default",
        "value": 1
      },
      {
        "x": 5,
        "y": 8,
        "type": "default",
        "value": 1
      },
      {
        "x": 6,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      {
        "x": 7,
        "y": 8,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      {
        "x": 8,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      }
    ],
    "players": [
      {
        "id": "player1"
      },
      {
        "id": "player2"
      }
    ],
    "currentPlayer": "player2",
    "zoneLookup": {
      "11": {
        "x": 1,
        "y": 1,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "12": {
        "x": 1,
        "y": 2,
        "type": "default",
        "value": 1
      },
      "13": {
        "x": 1,
        "y": 3,
        "type": "default",
        "value": 1
      },
      "14": {
        "x": 1,
        "y": 4,
        "type": "default",
        "value": 1
      },
      "15": {
        "x": 1,
        "y": 5,
        "type": "default",
        "value": 1
      },
      "16": {
        "x": 1,
        "y": 6,
        "type": "default",
        "value": 1
      },
      "17": {
        "x": 1,
        "y": 7,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "18": {
        "x": 1,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "21": {
        "x": 2,
        "y": 1,
        "type": "default",
        "value": 1
      },
      "22": {
        "x": 2,
        "y": 2,
        "type": "default",
        "value": 1
      },
      "23": {
        "x": 2,
        "y": 3,
        "type": "default",
        "value": 1
      },
      "24": {
        "x": 2,
        "y": 4,
        "type": "default",
        "value": 1
      },
      "25": {
        "x": 2,
        "y": 5,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "26": {
        "x": 2,
        "y": 6,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "27": {
        "x": 2,
        "y": 7,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "28": {
        "x": 2,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "31": {
        "x": 3,
        "y": 1,
        "type": "default",
        "value": 1
      },
      "32": {
        "x": 3,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "33": {
        "x": 3,
        "y": 3,
        "type": "bonus",
        "value": 5
      },
      "34": {
        "x": 3,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "35": {
        "x": 3,
        "y": 5,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "36": {
        "x": 3,
        "y": 6,
        "owner": "player1",
        "type": "bonus",
        "value": 5
      },
      "37": {
        "x": 3,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "38": {
        "x": 3,
        "y": 8,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "41": {
        "x": 4,
        "y": 1,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "42": {
        "x": 4,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "43": {
        "x": 4,
        "y": 3,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "44": {
        "x": 4,
        "y": 4,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "45": {
        "x": 4,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "46": {
        "x": 4,
        "y": 6,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "47": {
        "x": 4,
        "y": 7,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "48": {
        "x": 4,
        "y": 8,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "51": {
        "x": 5,
        "y": 1,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "52": {
        "x": 5,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "53": {
        "x": 5,
        "y": 3,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "54": {
        "x": 5,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "55": {
        "x": 5,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "56": {
        "x": 5,
        "y": 6,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "57": {
        "x": 5,
        "y": 7,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "58": {
        "x": 5,
        "y": 8,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "61": {
        "x": 6,
        "y": 1,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "62": {
        "x": 6,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "63": {
        "x": 6,
        "y": 3,
        "owner": "player1",
        "type": "bonus",
        "value": 5
      },
      "64": {
        "x": 6,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "65": {
        "x": 6,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "66": {
        "x": 6,
        "y": 6,
        "owner": "player2",
        "type": "bonus",
        "value": 5
      },
      "67": {
        "x": 6,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "68": {
        "x": 6,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "71": {
        "x": 7,
        "y": 1,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "72": {
        "x": 7,
        "y": 2,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "73": {
        "x": 7,
        "y": 3,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "74": {
        "x": 7,
        "y": 4,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "75": {
        "x": 7,
        "y": 5,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "76": {
        "x": 7,
        "y": 6,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "77": {
        "x": 7,
        "y": 7,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "78": {
        "x": 7,
        "y": 8,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "81": {
        "x": 8,
        "y": 1,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "82": {
        "x": 8,
        "y": 2,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "83": {
        "x": 8,
        "y": 3,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "84": {
        "x": 8,
        "y": 4,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "85": {
        "x": 8,
        "y": 5,
        "owner": "player2",
        "type": "default",
        "value": 1
      },
      "86": {
        "x": 8,
        "y": 6,
        "owner": "player3",
        "type": "default",
        "value": 1
      },
      "87": {
        "x": 8,
        "y": 7,
        "owner": "player1",
        "type": "default",
        "value": 1
      },
      "88": {
        "x": 8,
        "y": 8,
        "owner": "player1",
        "type": "default",
        "value": 1
      }
    },
    "boundaries": [
      1,
      8
    ],
    "endGame": [
      {
        "id": "player3",
        "score": 0,
        "reason": "no-actions",
        "turnsPlayed": 57
      }
    ]
  }


 -->
