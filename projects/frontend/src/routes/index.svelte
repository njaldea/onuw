<script lang='ts'>
    import { goto } from '$app/navigation';
    let name = '';

    function next() {
        if (name) {
            goto(`/chat/${name}`);
        }
    }
</script>

<input type='text' bind:value={name}>
<button on:click={next}>Next</button>


<style>
    input {
        width: 100%;
    }
    button {
        width: 100%;
    }
</style>