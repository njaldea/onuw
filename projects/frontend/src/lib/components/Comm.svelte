<script lang="ts">
    import { Connection } from '$lib/connection';
    import { Chatters } from '$lib/connection/Chatters';
    import { Messages } from '$lib/connection/Messages';

    import { CHATTERS_URL } from '$lib/env';
    import { setContext } from 'svelte';

    let connection = new Connection();

    setContext('chatters', new Chatters(connection));
    setContext('messages', new Messages(connection));
</script>

{#await connection.connect(CHATTERS_URL) then}
    <slot />
{/await}
