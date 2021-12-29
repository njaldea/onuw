<script lang="ts">
    import Comm from '$lib/components/Comm.svelte';
</script>

<Comm>
    <div class="root">
        <div>
            <slot />
        </div>
    </div>
</Comm>

<style>
    .root > div {
        width: 85%;

        margin: auto;
        margin-top: 20px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 10px;

        box-shadow: 0 0 20px 10px;
    }

    .root {
        width: 100%;
        height: 100%;
        display: grid;
        color: var(--color);
        background-color: var(--background-color);
    }
</style>
