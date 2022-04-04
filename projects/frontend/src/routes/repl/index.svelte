<script lang="ts">
    import { onMount, SvelteComponent } from 'svelte';
    import RuntimeCompiled from './_RuntimeCompiled.svelte';
    import { request } from './_module_worker';

    let components: Record<string, typeof SvelteComponent> = {};

    const tags = ['App'];

    onMount(async () => {
        const doc = await request([...new Set(tags)]);

        if (doc) {
            const blob = new Blob([doc], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            components = await import(/* @vite-ignore */ url);
        }
    });
</script>

<div>
    {#each tags as tag}
        {#if components[tag]}
            <RuntimeCompiled
                ComponentType={components[tag]}
                props={{ text: { value: 'Hello World' } }}
                events={['click']}
            />
        {/if}
    {/each}
</div>

<style>
    div {
        width: 500px;
        display: flex;
        flex-direction: column;
    }
</style>
