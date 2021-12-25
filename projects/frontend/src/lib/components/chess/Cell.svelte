<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Cell } from '$lib/game/Cell';

    import tooltip from '$lib/stores/tooltip';

    export let alt: boolean;
    export let cell: Cell;

    import draggableaction from '$lib/actions/draggable';
    import cellinteropaction from '$lib/actions/cellinterop';

    const dispatch = createEventDispatcher();

    export let debug = true;
    $: debugtext = `--debug-detail: "[${cell.id}]"`;

    let grabbed = false;

    function start() {
        grabbed = true;
        dispatch('piecedragstart', { cell });
    }

    function end(origin: HTMLDivElement, candidates: Element[]) {
        grabbed = false;
        for (const candidate of candidates) {
            if (candidate !== origin.parentElement && candidate.classList.contains('cell')) {
                candidate.dispatchEvent(
                    new CustomEvent('getcellid', { detail: { target: origin.parentElement } })
                );
                return;
            }
        }
        dispatch('piecedragcancel');
    }

    const draggable = draggableaction(start, end);
    const cellinterop = cellinteropaction(cell);
</script>

<div
    class:grabbed
    class:targeted={cell.targeted}
    class="cell"
    class:alt
    class:debug
    style={debugtext}
    on:mouseenter={() => tooltip.add(cell.id, cell)}
    on:mouseleave={() => tooltip.remove(cell.id)}
    use:cellinterop
    on:piecedragconfirm
>
    {#if cell.piece !== null}
        <div class="boundedpiece" use:draggable={{ piece: cell.piece }}>
            <div class="piece" class:team={cell.piece.team}>{cell.piece.role}</div>
        </div>
    {/if}
</div>

<style>
    div.debug {
        position: relative;
    }

    div.debug::after {
        background: white;
        outline: solid 2px black;
        color: black;
        position: absolute;
        top: 0px;
        left: 0px;
        min-width: 20px;
        min-height: 20px;
        padding: 0px 2px;
        text-align: center;
        content: var(--debug-detail);
    }

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    div.grabbed {
        z-index: 1;
    }

    .cell {
        position: relative;
        background: white;
    }

    .cell.alt {
        background: black;
    }

    .cell.targeted {
        background: lightskyblue;
    }

    .boundedpiece {
        color: red;
        position: absolute;
    }

    .piece {
        width: 80%;
        height: 80%;
        background: black;
        outline: 2px solid white;
        color: red;
    }

    .piece.team {
        background: white;
        outline: 2px solid black;
    }
</style>
