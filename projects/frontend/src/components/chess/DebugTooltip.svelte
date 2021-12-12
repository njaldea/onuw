<script lang="ts">
    import tooltip from '$stores/tooltip';
    import followmouse from '$lib/actions/followmouse';
    import type { Cell } from '$lib/chess/Cell';

    $: entries = Object.entries($tooltip) as [string, Cell][];
</script>

<div use:followmouse>
    {#if Object.keys($tooltip).length > 0}
        <table>
            <tr>
                <th>ID</th>
                <th>attackedby</th>
                <th>supportedby</th>
                <th>touched</th>
            </tr>
            {#each entries as [key, value] (key)}
                <tr>
                    <td>{key}</td>
                    <td>{JSON.stringify(value.attackedby)}</td>
                    <td>{JSON.stringify(value.supportedby)}</td>
                    <td>{value.touched}</td>
                </tr>
            {/each}
        </table>
    {/if}
</div>

<style>
    div {
        z-index: 9999;
        outline: 2px solid black;
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: lightgreen;
        color: black;
    }

    div:empty {
        display: none;
    }

    table,
    th,
    td {
        border: 1px solid black;
    }
</style>
