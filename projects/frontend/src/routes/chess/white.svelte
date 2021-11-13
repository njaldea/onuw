<script lang='ts'>
    import Board from '$components/chess/Board.svelte';
    import { getCells } from '$lib/chess';
    const { dimension, cells } = getCells();
</script>

<div>
    <Board flipped={false} {cells} {dimension}/>
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>