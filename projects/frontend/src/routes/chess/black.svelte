<script lang='ts'>
    import Board from '$components/chess/Board.svelte';
    import { getCells } from '$lib/chess';
    const { dimension, cells, teams } = getCells();
</script>

<div>
    <Board flipped={true} {teams} {cells} {dimension}/>
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>