<script lang="ts">
    import Context from '$lib/components/Context.svelte';
    import Chess from '$lib/components/Chess.svelte';
    import DebugTooltip from '$lib/components/chess/DebugTooltip.svelte';
    import { Tooltip } from '$lib/game/Tooltip';

    const fields = {
        tooltip: new Tooltip()
    };

    export let flipped = false;
</script>

<Context {fields}>
    <DebugTooltip />
    <Chess {flipped} />
</Context>
