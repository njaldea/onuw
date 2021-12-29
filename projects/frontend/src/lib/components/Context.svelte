<script lang="ts">
    import { setContext } from 'svelte';

    export let fields = {};

    for (const [key, value] of Object.entries(fields)) {
        setContext(key, value);
    }
</script>

<slot />
