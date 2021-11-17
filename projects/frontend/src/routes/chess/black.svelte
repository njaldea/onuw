<script lang='ts'>
    import GameBoard from '$components/chess/GameBoard.svelte';
    import { getCells } from '$lib/chess';
    const { dimension, cells, players } = getCells();
</script>

<div>
    <GameBoard flipped={true} {players} {cells} {dimension}/>
</div>

<style>
    div {
        width: 100%;
        min-width: calc(25px * 8);
        max-width: calc(100px * 8);
    }
</style>