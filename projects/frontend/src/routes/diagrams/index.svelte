<script lang="ts">
    type Data = {
        class: string;
        content?: string;
    };

    function* fill(count: number, cb: (i: number) => Data = null) {
        for (let i = 0; i < count; ++i) yield cb && cb(i);
    }

    const data: Data[][] = [
        [
            { class: 'default', content: 'TS' },
            ...fill(13, (i) => {
                return { class: 'default', content: `${i}` };
            }),
            { class: 'default', content: '\u221e' }
        ],
        [
            { class: 'default', content: 'Log' },
            { class: 'limit' },
            ...fill(2),
            { class: 'logspan', content: 'span\nstart' },
            ...fill(6),
            { class: 'logspan', content: 'span\nend' },
            ...fill(2),
            { class: 'limit' }
        ],
        [
            { class: 'default', content: 'LogView' },
            { class: 'limit' },
            ...fill(2),
            { class: 'logspan', content: 'begin()' },
            ...fill(6),
            { class: 'logspan', content: 'end()' },
            ...fill(2),
            { class: 'limit' }
        ],
        [
            { class: 'default', content: 'LogView\nIterator' },
            { class: 'limit', content: 'time\nmin' },
            ...fill(2),
            { class: 'logspan', content: '' },
            ...fill(6),
            { class: 'logspan', content: '' },
            ...fill(2),
            { class: 'limit', content: 'time\nmax' }
        ],
        [
            { class: 'default', content: 'CH.A' },
            { class: 'limit', content: 'time\nmin' },
            ...fill(2),
            { class: 'logspan' },
            { class: 'occupied', content: 'A' },
            ...fill(2),
            { class: 'occupied', content: 'A' },
            ...fill(1),
            { class: 'occupied', content: 'A' },
            { class: 'logspan' },
            ...fill(2),
            { class: 'limit', content: 'time\nmax' }
        ],
        [
            { class: 'default', content: 'CH.B' },
            { class: 'limit', content: 'time\nmin' },
            ...fill(2),
            { class: 'logspan', content: 'B' },
            ...fill(1),
            { class: 'occupied', content: 'B' },
            ...fill(2),
            { class: 'occupied', content: 'B' },
            { class: 'occupied', content: 'B' },
            { class: 'logspan', content: 'B' },
            ...fill(2),
            { class: 'limit', content: 'time\nmax' }
        ]
    ];
    data.forEach((d) => console.assert(d.length == 15, d.length));

    let selected = -1;

    function begin() {
        selected = 3;
    }

    function end() {
        selected = 13;
    }

    function prev() {
        let current = selected;
        while (current > 0) {
            current -= 1;
            for (const d of data) {
                const { class: cl, content } = d[current + 1] ?? {};
                if (['occupied', 'logspan'].includes(cl) && content != null) {
                    selected = current;
                    return;
                }
            }
        }
        selected = current;
    }

    function next() {
        let current = selected;
        while (current < 13) {
            current += 1;
            for (const d of data) {
                const { class: cl, content } = d[current + 1] ?? {};
                if (['occupied', 'logspan'].includes(cl) && content != null) {
                    selected = current;
                    return;
                }
            }
        }
        selected = current;
    }

    let inputvalue = -2;
    $: inputvalue = selected;

    function onselect(pos, index) {
        while (index > 0) {
            const { class: cl, content } = data[pos][index + 1] ?? {};
            if (cl === 'occupied' || cl === 'logspan') {
                if (content != null && content.length > 0) {
                    return index;
                }
            }
            index -= 1;
        }
        return -1;
    }
    $: msgA = onselect(4, selected);
    $: msgB = onselect(5, selected);

    function click(row, index) {
        selected = index - 1;
    }
</script>

<div class="center" style="--row-count: 4; --column-count: 15;">
    <div class="wrap">
        {#each data as d, r}
            {#each d as v, i}
                <div
                    class:msg={i !== 0 && r >= 4 && i - 1 === (r === 4 ? msgA : msgB)}
                    class:selected={i === selected + 1 && i !== 0}
                    class={`box ${v?.class ?? 'default'}`}
                    on:click={() => click(r, i)}
                >
                    {v?.content ?? ''}
                </div>
            {/each}
        {/each}
    </div>
    <div class="controls">
        <button on:click={begin}> begin </button>
        <button on:click={prev} disabled={selected === -1}> &lt; </button>
        <button on:click={next} disabled={selected === -1}> &gt; </button>
        <button on:click={end}> end </button>
        <input type="number" bind:value={inputvalue} />
        <button on:click={() => (selected = inputvalue)}> at </button>
    </div>
</div>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css" />
</svelte:head>

<style>
    * {
        font-family: 'Fira Code';
        font-size: 0.75rem;
    }

    .center {
        width: 100%;
        padding-top: 100px;
        gap: 5px;
        padding-bottom: 20px;
        display: grid;
        align-items: center;
        justify-content: center;
        background-color: gray;
        user-select: none;
    }

    .wrap,
    .line {
        gap: 4px;
    }

    .center.wrap.msg {
        font-weight: bolder;
    }

    .wrap {
        display: grid;
        background-color: black;
        grid-template-rows: repeat(var(--row-count), 1fr);
        grid-template-columns: repeat(var(--column-count), 1fr);
        padding: 4px;
    }

    .box {
        padding: 1.5px;
        display: grid;
        text-align: center;
        align-items: center;
        background-color: white;
        color: black;
        white-space: pre-line;
    }

    .box:not(.default) {
        color: white;
    }

    .box.limit {
        background-color: gray;
    }

    .box.occupied {
        background-color: burlywood;
        color: black;
    }

    .box.logspan {
        background-color: purple;
    }

    .controls > input {
        grid-column: 1 / 4;
        text-align: right;
    }

    .controls {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: repeat(4, 1fr);
        width: 200px;
    }

    .selected {
        outline: solid red 4px;
    }
    .msg {
        outline: dotted white 4px;
        background-color: slateblue !important;
    }
</style>
