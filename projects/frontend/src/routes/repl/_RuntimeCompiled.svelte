<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { SvelteComponent } from 'svelte';
    import { writable } from 'svelte/store';
    import type { Writable } from 'svelte/store';

    export let ComponentType: typeof SvelteComponent;
    type PropDetail = {
        value: any;
        path?: string;
    };
    export let props: Record<string, PropDetail>;
    export let events: string[];

    let div: HTMLDivElement;
    let component: SvelteComponent;

    onMount(() => {
        const writables: Record<string, Writable<any>> = {};

        for (const [key, { value, path }] of Object.entries(props)) {
            writables[key] = writable(value);
            writables[key].subscribe((v) => console.log('changing', key, v, path));
        }

        component = new ComponentType({ target: div, props: writables });

        for (const event of events) {
            component.$on(event, () => console.log('event called', event));
        }
    });

    onDestroy(() => component && component.$destroy());
</script>

<div bind:this={div} />
