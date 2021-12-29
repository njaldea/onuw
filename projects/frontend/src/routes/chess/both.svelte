<script lang="ts">
    import Chess from '$lib/components/Chess.svelte';
</script>

<svelte:head><title>Chess</title></svelte:head>

<div class="root">
    <div class="board">
        <p>white</p>
        <Chess flipped={false} />
    </div>
    <div class="board">
        <p>black</p>
        <Chess flipped={true} />
    </div>
</div>

<style>
    .root {
        display: flex;
        width: 100%;
        gap: 10px;
    }

    .board {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        aspect-ratio: 1;
    }
</style>
