<script context="module">
    export const hydrate = false;
    export const router = false;
</script>

<script lang="ts">
    const length = 14;
    // prettier-ignore
    const classesA = [
        "limit",
        "none",
        "none",
        "logspan",
        "occupied",
        "none",
        "none",
        "occupied",
        "none",
        "occupied",
        "logspan",
        "none",
        "none",
        "limit"
    ];

    // prettier-ignore
    const classesB = [
        "limit",
        "none",
        "none",
        "logspan",
        "none",
        "occupied",
        "none",
        "none",
        "occupied",
        "occupied",
        "logspan",
        "none",
        "none",
        "limit"
    ];

    // prettier-ignore
    const label = [
        'time_point\nmin()',
        '...',
        '...',
        'Log\nspan\nstart',
        '',
        '',
        '',
        '',
        '',
        '',
        'Log\nspan\nend',
        '...',
        '...',
        'time_point\nmax()'
    ];
</script>

<div class="center">
    <div class="wrap">
        <div class="line">
            <div class="box ID">TS</div>
            {#each { length } as _, c}
                <div class={`box ID`}>
                    {#if c === length - 1}
                        &#8734
                    {:else}
                        {c}
                    {/if}
                </div>
            {/each}
        </div>
        <div class="line">
            <div class="box ID">ChannelA</div>
            {#each { length } as _, c}
                <div class={`box ${classesA[c]}`}>
                    {label[c]}
                </div>
            {/each}
        </div>
        <div class="line">
            <div class="box ID">ChannelB</div>
            {#each { length } as _, c}
                <div class={`box ${classesB[c]}`}>
                    {label[c]}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    div {
        margin: 0px;
        padding: 0px;
    }

    .center {
        width: 100%;
        height: 400px;
        display: grid;
        align-items: center;
        justify-content: center;
        background-color: white;
    }

    .wrap {
        display: flex;
        flex-direction: column;
        background-color: black;
        padding: 2px;
        gap: 2px;
    }

    .line {
        display: flex;
        gap: 2px;
    }

    .box {
        height: 73px;
        aspect-ratio: 1;
        border: black solid 1px;
        align-items: center;
        justify-content: center;
        text-align: center;
        display: grid;
        white-space: pre-line;
        background-color: black;
        color: white;
    }

    .ID {
        background-color: white;
        color: black;
    }

    .limit {
        background-color: gray;
    }

    .occupied {
        background-color: burlywood;
    }

    .none {
        background-color: white;
        color: black;
    }

    .logspan {
        background-color: purple;
    }
</style>
