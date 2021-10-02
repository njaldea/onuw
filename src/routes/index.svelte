<div class='root'>
    <div>
    </div>
</div>

<style>
    div > div {
        width: 50%;
        height: 50%;
        background-color: red;
    }

    .root {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
    }

    :global(*, *::before, *::after) {
        box-sizing: border-box;
        margin: 0;
        border: 0;
    }

    :global(html, body, #svelte) {
        width: 100%;
        height: 100%;
    }
</style>