<script lang="ts">
    import Context from '$lib/components/Context.svelte';

    import { Connection } from '$lib/connection';
    import { Chatters } from '$lib/connection/Chatters';
    import { Messages } from '$lib/connection/Messages';

    import { CHATTERS_URL } from '$lib/env';

    let connection = new Connection();

    const fields = {
        chatters: new Chatters(connection),
        messages: new Messages(connection)
    };
</script>

<Context {fields}>
    {#await connection.connect(CHATTERS_URL) then}
        <slot />
    {/await}
</Context>
