<script>
    export let text;

    import Button from 'onuw/components/Button.svelte';
</script>

<div>{$text}</div>
<Button>From Label</Button>

<style>
    div {
        width: 100%;
        color: white;
    }
</style>
