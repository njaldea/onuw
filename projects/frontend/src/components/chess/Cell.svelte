<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Cell } from '$lib/chess/Cell';

    export let alt: boolean;
    export let cell: Cell;

    import draggableaction from '$lib/actions/draggable';
    import cellinteropaction from '$lib/actions/cellinterop';

    const dispatch = createEventDispatcher();

    let grabbed = false;

    function start() {
        grabbed = true;
        dispatch('piecedragstart', { cell });
    }

    function end(origin: HTMLDivElement, candidates: Element[]) {
        grabbed = false;
        const matches = candidates.filter(
            (c) => c !== origin.parentElement && c.classList.contains('cell')
        );
        if (matches.length > 0) {
            matches[0].dispatchEvent(new CustomEvent('getcellid', { detail: { target: origin } }));
        } else {
            dispatch('piecedragcancel');
        }
    }

    const draggable = draggableaction(start, end);
    const cellinterop = cellinteropaction(cell);
</script>

<div
    class:grabbed
    class:targeted={cell.targeted}
    class="cell"
    class:alt
    use:cellinterop
    on:piecedragconfirm={(ev) => dispatch('piecedragconfirm', ev.detail)}
>
    {#if cell.piece !== null}
        <div class="boundedpiece" use:draggable={{ piece: cell.piece }}>
            <div class="piece" class:team={cell.piece.team}>{cell.piece.role}</div>
        </div>
    {/if}
</div>

<style>
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
