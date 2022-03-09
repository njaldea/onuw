<script lang="ts" context="module">
    type Data = {
        class: string;
        content?: string;
    };

    function* fill<ReturnType>(count: number, cb: (i: number) => ReturnType = null) {
        for (let i = 0; i < count; ++i) yield cb && cb(i);
    }

    function onselect(enabled: boolean, d: Data[], index: number) {
        while (index > 0) {
            const { class: cl, content } = d[index + 1] ?? {};
            if (enabled && (cl === 'occupied' || cl === 'logspan')) {
                if (content != null && content.length > 0) {
                    return index;
                }
            }
            index -= 1;
        }
        return -1;
    }

    function createRandomData(spancount: number, tag: string): Data[] {
        const random = () => Math.floor(Math.random() * 2) === 1;
        return [
            { class: 'default', content: `CH.${tag}` },
            { class: 'limit', content: 'time\nmin' },
            ...fill<Data>(2),
            { class: 'logspan', content: random() ? tag : null },
            ...fill<Data>(spancount, (i) =>
                random() ? { class: 'occupied', content: tag } : null
            ),
            { class: 'logspan', content: random() ? tag : null },
            ...fill<Data>(2),
            { class: 'limit', content: 'time\nmax' }
        ];
    }

    function populateData(chcount: number, spancount: number) {
        return [
            [
                { class: 'default', content: 'TS' },
                { class: 'default', content: '-\u221e' },
                ...fill<Data>(6 + spancount, (i) => ({ class: 'default', content: `${201 + i}` })),
                { class: 'default', content: '+\u221e' }
            ],
            [
                { class: 'default', content: 'Log' },
                { class: 'limit' },
                ...fill<Data>(2),
                { class: 'logspan', content: 'span\nstart' },
                ...fill<Data>(spancount),
                { class: 'logspan', content: 'span\nend' },
                ...fill<Data>(2),
                { class: 'limit' }
            ],
            [
                { class: 'default', content: 'LogView' },
                { class: 'limit' },
                ...fill<Data>(2),
                { class: 'logspan', content: 'begin()' },
                ...fill<Data>(spancount),
                { class: 'logspan' },
                ...fill<Data>(2),
                { class: 'limit', content: 'end()' }
            ],
            [
                { class: 'default', content: 'LogView\nIterator' },
                { class: 'limit', content: 'time\nmin' },
                ...fill<Data>(2),
                { class: 'logspan', content: '' },
                ...fill<Data>(spancount),
                { class: 'logspan', content: '' },
                ...fill<Data>(2),
                { class: 'limit', content: 'time\nmax' }
            ],
            ...fill<Data[]>(chcount, (i) =>
                createRandomData(spancount, String.fromCharCode(65 + i))
            )
        ];
    }

    function move_gen(spancount: number, predicate: (r: number, i: number) => boolean) {
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
            prev: (current: number, r?: number) =>
                move(
                    current,
                    (i) => i - 1,
                    (i) => i > 0,
                    (i) => predicate(r, i)
                ),
            next: (current: number, r?: number) =>
                move(
                    current,
                    (i) => i + 1,
                    (i) => i < 7 + spancount,
                    (i) => predicate(r, i)
                )
        };
    }

    function move_check_one(data: Data[][], r: number, i: number) {
        const { class: cl, content } = data[r][i + 1] ?? {};
        return ['occupied', 'logspan'].includes(cl) && content != null;
    }

    function move_check_all(enabled: boolean[], data: Data[][], r: number, i: number) {
        return data.some((_, row) => enabled[row] && move_check_one(data, row, i));
    }
</script>

<script lang="ts">
    let channelcount = 4;
    let spancount = 6;
    $: data = populateData(channelcount, spancount);
    let selected = -1;

    const headercount = 4;

    $: enabled = [
        ...fill<boolean>(headercount, () => false), // headers
        ...fill<boolean>(channelcount, () => true) // channels
    ];

    let inputvalue = 200;
    $: inputvalue = selected + 200;

    $: selectedmsgs = [
        ...fill<number>(channelcount, (i) => onselect(enabled[i + 4], data[i + 4], selected))
    ];

    $: letters = [...fill<string>(channelcount, (i) => String.fromCharCode(97 + i))];
    const togridarea = (l: string[], c: string, i: number) => `${c}${l[i]}`;
    const gridareas = ['c', 'p', 'p', 'n', 'n'];
    $: tablerow = (l: string[]) => {
        return (i: number) => gridareas.map((c) => togridarea(l, c, i)).join(' ');
    };
    $: table = `"${[
        '.   bb1 pp1 nn1 ee1',
        ...fill<string>(channelcount, tablerow(letters)),
        'ii2 ii2 ii2 ii2 at2',
        're3 re3 re3 re3 re3'
    ].join('" "')}"`;

    $: move_A = move_gen(spancount, (r, i) => move_check_all(enabled, data, r, i));
    $: move_X = move_gen(spancount, (r, i) => move_check_one(data, r, i));
</script>

<div class="center" style={`--column-count: ${9 + spancount};`}>
    <div style:grid-area="counts">
        <div class="counts">
            <input type="range" min="0" max="20" bind:value={spancount} />
            <input type="range" min="0" max="20" bind:value={channelcount} />
        </div>
    </div>
    <div style:grid-area="data">
        <div class="data" style={`--row-count: ${data.length}`}>
            {#each data as d, r}
                {#each d as v, i}
                    <div
                        class:msg={enabled[r] && i !== 0 && r >= 4 && i - 1 === selectedmsgs[r - 4]}
                        class:selected={i === selected + 1 && i !== 0}
                        class={`box ${v?.class ?? 'default'}`}
                        on:click={() => (selected = i - 1)}
                    >
                        {v?.content ?? ''}
                    </div>
                {/each}
            {/each}
        </div>
    </div>
    <div style:grid-area="controls">
        <div class="controls" style={`--row-count: ${channelcount + 3}; --table: ${table}`}>
            <button style:grid-area="bb1" on:click={() => (selected = 3)}> begin </button>
            <button style:grid-area="ee1" on:click={() => (selected = 7 + spancount)}> end </button>
            <button
                style:grid-area="pp1"
                on:click={() => (selected = move_A.prev(selected))}
                disabled={selected === -1}
            >
                &lt
            </button>
            <button
                style:grid-area="nn1"
                on:click={() => (selected = move_A.next(selected))}
                disabled={selected === -1}
            >
                &gt
            </button>
            {#each letters as name, ctr}
                {@const index = ctr + headercount}
                {@const disabled = selected === -1 || !enabled[index]}
                {@const NAME = name.toUpperCase()}
                <input style:grid-area={`c${name}`} type="checkbox" bind:checked={enabled[index]} />
                <button
                    {disabled}
                    style:grid-area={`p${name}`}
                    on:click={() => (selected = move_X.prev(selected, index))}
                >
                    [{NAME}] &lt
                </button>
                <button
                    {disabled}
                    style:grid-area={`n${name}`}
                    on:click={() => (selected = move_X.next(selected, index))}
                >
                    &gt [{NAME}]
                </button>
            {/each}
            <button
                style:grid-area="at2"
                on:click={() => (selected = Math.max(Math.min(inputvalue - 199, 13), 0))}
            >
                at
            </button>
            <input
                style:grid-area="ii2"
                bind:value={inputvalue}
                type="number"
                min="-1000"
                max="+1000"
            />
            <button
                style:grid-area="re3"
                on:click={() => (data = populateData(channelcount, spancount))}
            >
                randomize
            </button>
        </div>
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
        background-color: gray;
        user-select: none;
        box-sizing: border-box;
        min-width: 1024px;
        width: 100%;
        display: grid;
        grid-template-areas:
            'counts counts'
            'controls data';
        justify-content: center;
        gap: 2px;
    }

    .center * {
        font-family: inherit;
        box-sizing: inherit;
    }

    .center > * {
        padding: 4px;
        background-color: black;
    }

    .center > div > div {
        gap: 2px;
    }

    .counts {
        display: grid;
    }

    .data {
        display: grid;
        grid-template-rows: repeat(var(--row-count), minmax(0, 35px));
        grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
    }

    .data > .box {
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

    .box.selected {
        outline: solid red 2px;
    }

    .box.msg {
        font-weight: bolder;
        outline: dashed white 2px;
        background-color: slateblue !important;
        color: white !important;
    }

    .controls > input {
        text-align: right;
    }

    .controls {
        display: grid;
        grid-template-rows: repeat(var(--row-count), 35px);
        grid-template-columns: repeat(5, 1fr);
        grid-template-areas: var(--table);
    }

    .controls > input[type='checkbox'] {
        width: 100%;
        height: 100%;
    }
</style>
