<script lang="ts">
    import Context from '$lib/components/Context.svelte';
    import DebugTooltip from '$lib/components/chess/DebugTooltip.svelte';
    import { Tooltip } from '$lib/game/Tooltip';

    const fields = {
        tooltip: new Tooltip()
    };
</script>

<Context {fields}>
    <DebugTooltip />

    <div class="root">
        <div>
            <nav>
                <a href="/chat">Chat</a>
                <a href="/chess/both">Chess</a>
                <a href="/chess/white">Chess - White</a>
                <a href="/chess/black">Chess - Black</a>
            </nav>

            <slot />
        </div>
    </div>
</Context>

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

    a {
        color: white;
    }
</style>
