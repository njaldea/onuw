import { writable } from 'svelte/store';
import type { Connection } from '$lib/connection';
import type { Subscriber, Unsubscriber, Writable } from 'svelte/store';

export class Chatters {
    private chatters: Writable<string[]>;
    private connection: Connection;

    public constructor(connection: Connection) {
        this.chatters = writable<string[]>([]);
        this.connection = connection;

        this.connection.on(1, (arg) => {
            this.chatters.set(arg.chatters);
        });
    }

    public subscribe(cb: Subscriber<string[]>): Unsubscriber {
        return this.chatters.subscribe(cb);
    }

    public add(chatter: string) {
        if (this.connection.connected()) {
            this.connection.send({ type: 2, chatter });
        }
    }

    public remove(chatter: string) {
        if (this.connection.connected()) {
            this.connection.send({ type: 3, chatter });
        }
    }
}
