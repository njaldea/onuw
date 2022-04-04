const app = `
    <script>
        export let text;
        import Label from 'onuw/components/Label.svelte';
        import Button from './subfolder/Button.svelte';
    </script>
    <h1>{$text}</h1>
    <input type="text" bind:value={$text}>
    <Label bind:text/>
    <div class='toplevel'>
        <div class='column'>
            <button on:click>Native Button</button>
        </div>
        <div class='column'>
            <Button/>
        </div>
    </div>
    <style>
        h1 { color: white; }
        input { width: 100%; }
        .toplevel {
            width: 100%;
            display: flex;
        }
        .column {
            width: 50%;
            display: flex;
            flex-direction: column;
        }
    </style>
`;

const button = `<button>Svelte Button</button>`;

/** @type {import('@sveltejs/kit').RequestHandler} */
export function get({ url: { searchParams } }) {
    const path = searchParams.get('path');
    if (path === './App.svelte') {
        return { status: 200, body: app };
    }
    if (path === './subfolder/Button.svelte') {
        return { status: 200, body: button };
    }
    return { status: 500 };
}
