<script lang="ts">
    import { onMount } from 'svelte';
    import { request } from './_module_worker';

    import { writable } from 'svelte/store';

    let doc: string;

    let component;
    let div: HTMLDivElement;

    let props = {
        text: writable('Hello World')
    };

    props.text.subscribe((v) => console.log(`prop is being updated ${v}`));

    async function process(d: string) {
        if (d) {
            const blob = new Blob([d], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const { default: Component } = await import(url);
            if (component) {
                component.$destroy();
            }
            component = new Component({ target: div, props });
        } else {
            if (component) {
                component.$destroy();
            }
            component = null;
        }
    }

    $: process(doc);

    onMount(async () => (doc = await request()));
</script>

<div bind:this={div} />
