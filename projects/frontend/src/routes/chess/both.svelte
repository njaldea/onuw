<div class='root'>
    <div class='board'>
        <p>white</p>
        <iframe title="white" src="/chess/white"></iframe>
    </div>
    <div class='board'>
        <p>black</p>
        <iframe title="black" src="/chess/black"></iframe>
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

    iframe {
        width: 100%;
        height: 100%;
    }
</style>