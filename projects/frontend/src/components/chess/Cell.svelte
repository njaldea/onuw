<script lang='ts'>
    import { createEventDispatcher } from 'svelte';
    import type { Cell } from '$lib/chess/Cell';

    export let alt: boolean;
    export let cell: Cell;

    import action from '$lib/actions/draggable';

    const dispatch = createEventDispatcher();

    let grabbed = false;

    function start()
    {
        grabbed = true;
        dispatch("piecedragstart", { id: cell.id });
    }

    function end(origin: HTMLDivElement, candidates: Element[])
    {
        grabbed = false;
        const matches = candidates.filter(c => c !== origin.parentElement && c.classList.contains("cell"));
        if (matches.length > 0) {
            matches[0].dispatchEvent(new CustomEvent("getcellid", { detail: origin }));
        } else {
            dispatch("piecedragcancel");
        }
    }

    const draggable = action(start, end);

    function getcellidresp(ev: CustomEvent)
    {
        dispatch("piecedragconfirm", { from: cell.id, to: ev.detail.to });
    }

    function getcellid(ev: CustomEvent)
    {
        const response = new CustomEvent("getcellidresp", { bubbles: true, detail: { to: cell.id } });
        ev.detail.dispatchEvent(response);
    }
</script>

<div
    class:grabbed
    class:targeted={cell.targeted}
    class="cell"
    class:alt
    on:getcellid={getcellid}
    on:getcellidresp={getcellidresp}
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