import type { Cell } from '$lib/game/Cell';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';

export class Tooltip {
    private enabled: Writable<boolean>;
    private contents: Writable<Record<number, Cell>>;
    private derived: Readable<Record<number, Cell>>;

    public constructor() {
        this.enabled = writable(false);
        this.contents = writable({});
        this.derived = derived([this.enabled, this.contents], ([e, c]) => (e ? c : {}));
    }

    public subscribe(cb: Subscriber<Record<number, Cell>>): Unsubscriber {
        return this.derived.subscribe(cb);
    }

    public enable(): void {
        this.enabled.set(true);
    }

    public disable(): void {
        this.enabled.set(false);
    }

    public add(key: number, cell: Cell): void {
        this.contents.update((v) => {
            const n = { ...v };
            n[key] = cell;
            return n;
        });
    }

    public remove(key: number): void {
        this.contents.update((v) => {
            const n = { ...v };
            delete n[key];
            return n;
        });
    }
}
