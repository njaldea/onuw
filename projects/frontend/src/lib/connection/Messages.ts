import { writable } from 'svelte/store';
import type { Connection } from '$lib/connection';
import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';

interface MessageData {
    name: string;
    message: string;
}

export class Messages {
    private messages: Writable<MessageData[]>;
    private connection: Connection;

    public constructor(connection: Connection) {
        this.messages = writable<MessageData[]>([]);
        this.connection = connection;

        this.connection.on(2, (arg) => {
            this.messages.update((v) => [...v, { name: arg.name, message: arg.message }]);
        });
    }

    public subscribe(cb: Subscriber<MessageData[]>): Unsubscriber {
        return this.messages.subscribe(cb);
    }

    public send(name: string, message: string) {
        if (this.connection.connected()) {
            this.connection.send({ type: 4, name, message });
        }
    }
}
