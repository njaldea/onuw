<script lang="ts">
    type Data = {
        class: string;
        content?: string;
    };

    function* fill(count: number, cb: (i: number) => Data = null) {
        for (let i = 0; i < count; ++i) yield cb && cb(i);
    }

    function createRandomData(tag: string): Data[] {
        const random = () => Math.floor(Math.random() * 2) === 1;
        return [
            { class: 'default', content: `CH.${tag}` },
            { class: 'limit', content: 'time\nmin' },
            ...fill(2),
            { class: 'logspan', content: random() ? tag : null },
            ...fill(6, (i) => (random() ? { class: 'occupied', content: tag } : null)),
            { class: 'logspan', content: random() ? tag : null },
            ...fill(2),
            { class: 'limit', content: 'time\nmax' }
        ];
    }

    function populateData() {
        return [
            [
                { class: 'default', content: 'TS' },
                { class: 'default', content: '-\u221e' },
                ...fill(12, (i) => ({ class: 'default', content: `${201 + i}` })),
                { class: 'default', content: '+\u221e' }
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
                { class: 'logspan' },
                ...fill(2),
                { class: 'limit', content: 'end()' }
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
            ],
            createRandomData('C'),
            createRandomData('D')
        ];
    }

    let data: Data[][] = populateData();
    let selected = -1;

    function move_gen(predicate) {
        function move(
            current: number,
            step: (i: number) => number,
            check: (i: number) => boolean,
            find: (i: number) => boolean
        ) {
            while (check(current)) {
                current = step(current);
                if (find(current)) {
                    return current;
                }
            }
            return current;
        }
        return {
            prev: (r?: number) =>
                (selected = move(
                    selected,
                    (i) => i - 1,
                    (i) => i > 0,
                    (i) => predicate(r, i)
                )),
            next: (r?: number) =>
                (selected = move(
                    selected,
                    (i) => i + 1,
                    (i) => i < 13,
                    (i) => predicate(r, i)
                ))
        };
    }

    function move_check_all(r: number, i: number) {
        for (const d of data) {
            const { class: cl, content } = d[i + 1] ?? {};
            if (['occupied', 'logspan'].includes(cl) && content != null) {
                return true;
            }
        }
        return false;
    }

    function move_check_one(r: number, i: number) {
        const { class: cl, content } = data[r][i + 1] ?? {};
        return ['occupied', 'logspan'].includes(cl) && content != null;
    }

    const { prev, next } = move_gen(move_check_all);
    const { prev: prevX, next: nextX } = move_gen(move_check_one);

    let inputvalue = 200;
    $: inputvalue = selected + 200;

    function onselect(d: Data[], index: number) {
        while (index > 0) {
            const { class: cl, content } = d[index + 1] ?? {};
            if (cl === 'occupied' || cl === 'logspan') {
                if (content != null && content.length > 0) {
                    return index;
                }
            }
            index -= 1;
        }
        return -1;
    }
    $: msgA = onselect(data[4], selected);
    $: msgB = onselect(data[5], selected);
    $: msgC = onselect(data[6], selected);
    $: msgD = onselect(data[7], selected);

    $: disabled = selected === -1;
</script>

<div class="center" style="--column-count: 15;">
    <div class="wrap" style={`--row-count: ${data.length}`}>
        {#each data as d, r}
            {#each d as v, i}
                <div
                    class:msg={i !== 0 && r >= 4 && i - 1 === [msgA, msgB, msgC, msgD][r - 4]}
                    class:selected={i === selected + 1 && i !== 0}
                    class={`box ${v?.class ?? 'default'}`}
                    on:click={() => (selected = i - 1)}
                >
                    {v?.content ?? ''}
                </div>
            {/each}
        {/each}
    </div>
    <div class="controls" style={`--row-count: 7`}>
        <button style:grid-area="bb" on:click={() => (selected = 3)}> begin </button>
        <button style:grid-area="ee" on:click={() => (selected = 13)}> end </button>
        <button style:grid-area="pp" on:click={() => prev()} {disabled}> &lt </button>
        <button style:grid-area="nn" on:click={() => next()} {disabled}> &gt </button>
        <button style:grid-area="pa" on:click={() => prevX(4)} {disabled}> [A] &lt </button>
        <button style:grid-area="na" on:click={() => nextX(4)} {disabled}> &gt [A] </button>
        <button style:grid-area="pb" on:click={() => prevX(5)} {disabled}> [B] &lt </button>
        <button style:grid-area="nb" on:click={() => nextX(5)} {disabled}> &gt [B] </button>
        <button style:grid-area="pc" on:click={() => prevX(6)} {disabled}> [C] &lt </button>
        <button style:grid-area="nc" on:click={() => nextX(6)} {disabled}> &gt [C] </button>
        <button style:grid-area="pd" on:click={() => prevX(7)} {disabled}> [D] &lt </button>
        <button style:grid-area="nd" on:click={() => nextX(7)} {disabled}> &gt [D] </button>
        <button
            style:grid-area="at"
            on:click={() => (selected = Math.max(Math.min(inputvalue - 199, 13), 0))}
        >
            at
        </button>
        <input style:grid-area="ii" bind:value={inputvalue} type="number" min="-1000" max="+1000" />
        <button style:grid-area="re" on:click={() => (data = populateData())}> reload </button>
    </div>
</div>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css" />
</svelte:head>

<style>
    .center {
        font-family: 'Fira Code';
        font-size: 0.8rem;
        padding-top: 100px;
        padding-bottom: 100px;
        display: grid;
        align-items: center;
        justify-content: center;
        background-color: gray;
        user-select: none;
        box-sizing: border-box;
        gap: 2px;
        min-width: 1024px;
    }

    .center * {
        font-family: inherit;
        box-sizing: inherit;
    }

    .center > * {
        width: 1024px;
        padding: 4px;
        gap: 4px;
        background-color: black;
    }

    .wrap {
        display: grid;
        grid-template-rows: repeat(var(--row-count), minmax(0, 35px));
        grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
    }

    .box {
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
        background-color: steelblue;
    }

    .box.occupied {
        background-color: burlywood;
        color: black;
    }

    .box.logspan {
        background-color: purple;
    }

    .controls > input {
        text-align: right;
    }

    .controls {
        display: grid;
        width: calc((100% * 4 / var(--column-count) + 3px));
        grid-template-rows: repeat(var(--row-count), 25px);
        grid-template-columns: repeat(4, 1fr);

        grid-template-areas:
            'bb pp nn ee'
            'pa pa na na'
            'pb pb nb nb'
            'pc pc nc nc'
            'pd pd nd nd'
            'ii ii ii at'
            're re re re';
    }

    .selected {
        outline: solid red 2px;
    }

    .msg {
        font-weight: bolder;
        outline: dashed white 2px;
        background-color: slateblue !important;
        color: white !important;
    }
</style>
