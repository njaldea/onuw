<script lang='ts'>
    import { createEventDispatcher } from 'svelte';
    import type { Piece } from '$lib/types/Chess';
    export let id: number;
    export let alt: boolean;
    export let piece: null|Piece;
    export let targeted = true;

    import action from '$lib/actions/draggable';

    const dispatch = createEventDispatcher();

    function start()
    {
        dispatch("piecedragstart", { id });
    }

    function end(origin: HTMLDivElement, candidates: Element[])
    {
        const matches = candidates.filter(c => c !== origin.parentElement && c.classList.contains("cell"));
        if (matches.length > 0) {
            matches[0].dispatchEvent(new CustomEvent("dragconfirm", { detail: { from: id } }));
        } else {
            dispatch("dragcancel");
        }
    }

    const draggable = action(start, end);

    function dragconfirm(ev: CustomEvent)
    {
        dispatch("dragconfirm", { from: ev.detail.from, to: id });
    }
</script>

<div class:targeted class="cell" class:alt on:dragconfirm={dragconfirm}>
    {#if piece !== null}
        <div class="boundedpiece" use:draggable={{ piece: piece }}>
            <div class="piece" class:team={piece.team}>{piece.role}</div>
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