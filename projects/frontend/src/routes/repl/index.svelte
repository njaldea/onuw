<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { Component } from './_types';

    // vite will handle this
    // TODO: find a way to use typescript for the worker script

    import Worker from './_worker.ts?worker';

    let worker: Worker;

    let components: Component[] = [
        {
            id: 0,
            name: 'App',
            type: 'svelte',
            source: `<script>import Component from './Component1.svelte';<\/script><Component />`
        },
        {
            id: 1,
            name: 'Component1',
            type: 'svelte',
            source: '<h1>Hello</h1>'
        }
    ];

    let registeredHandle: (event: MessageEvent<any>) => void;

    function handle(event: MessageEvent<any>) {
        console.log(event.data);
    }

    function waitReady(event: MessageEvent<string>) {
        if (event.data === 'ready') {
            worker.removeEventListener('message', waitReady);
            worker.addEventListener('message', handle);
            registeredHandle = handle;
            worker.postMessage(components);
        }
    }

    onMount(async () => {
        worker = await new Worker();
        worker.addEventListener('message', waitReady);
        registeredHandle = waitReady;
    });

    onDestroy(async () => {
        if (worker) {
            if (registeredHandle) {
                worker.removeEventListener('message', registeredHandle);
            }
            worker.terminate();
        }
    });
</script>
