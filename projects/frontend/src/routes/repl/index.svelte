<script lang="ts">
    import { onMount, SvelteComponent } from 'svelte';
    import RuntimeCompiled from './_RuntimeCompiled.svelte';
    import { request } from './_module_worker';

    let components: Record<string, typeof SvelteComponent> = {};

    onMount(async () => {
        const doc = await request();

        if (doc) {
            const blob = new Blob([doc], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            components = (await import(/* @vite-ignore */ url)).default;
        }
    });
</script>

{#each Object.entries(components) as [key, ComponentType]}
    <RuntimeCompiled
        {ComponentType}
        props={{ text: { value: 'Hello World' } }}
        events={['click']}
    />
{/each}
