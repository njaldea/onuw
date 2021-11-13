<script lang='ts'>
    import { createEventDispatcher } from 'svelte';
    import type { Piece } from '$lib/types/Chess';
    export let color: string;
    export let piece: null|Piece;
    export let position: [number, number];
    export let targetable: boolean = true;

    import action from '$lib/actions/draggable';

    const dispatch = createEventDispatcher();

    function start()
    {
        dispatch("piecedragstart", { ref: position });
    }

    function end(origin: HTMLDivElement, candidates: HTMLElement[])
    {
        const matches = candidates.filter(c => c !== origin.parentElement && c.classList.contains("cell"));
        if (matches.length > 0) {
            matches[0].dispatchEvent(new CustomEvent("dragconfirm", {detail: { from: position }}));
        } else {
            dispatch("dragcancel");
        }
    }

    const { draggable } = action(start, end);

    function dragconfirm(ev: CustomEvent)
    {
        dispatch("dragconfirm", { from: ev.detail.from, to: position });
    }
</script>

<div class:targetable class="cell" style={`--cellcolor: ${color}`} on:dragconfirm={dragconfirm}>
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
        background: var(--cellcolor);
    }

    .cell.targetable {
        background: lightskyblue;
    }

    .boundedpiece {
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