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
