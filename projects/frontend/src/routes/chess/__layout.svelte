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
    <slot />
</Context>
