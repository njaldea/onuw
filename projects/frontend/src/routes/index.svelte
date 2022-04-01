<script lang="ts">
    let width: number;
    let height: number;
    let childcount = 18;
    $: sidepx = Math.sqrt((width * height) / childcount);
    $: console.log(sidepx);
</script>

<section>
    <a href="/3D">3D</a>
    <a href="/chess">chess</a>
    <a href="/diagrams">diagrams</a>
</section>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css" />
</svelte:head>

<div class="center">
    <input type="number" bind:value={childcount} />
    <div class="root" bind:clientHeight={height} bind:clientWidth={width}>
        {#each { length: childcount } as _}
            <div class="wrapper" style:width={`${sidepx}px`} />
        {/each}
    </div>
</div>

<style>
    section {
        flex-direction: column;
        font-family: 'Fira Code', 'Courier New', Courier, monospace;
        padding: 2rem;
    }

    a {
        color: white;
    }

    .center {
        outline: white 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 4px;
        height: 70%;
    }

    .root {
        width: 100%;
        height: 80%;
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
    }

    .wrapper {
        background-color: blue;
        flex-grow: 1;
    }
</style>
