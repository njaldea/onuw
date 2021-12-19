import type { Cell } from '$lib/game/Cell';
import { derived, writable } from 'svelte/store';
import type { Subscriber, Unsubscriber } from 'svelte/store';

const store = writable<Record<number, Cell>>({});
const enabled = writable<boolean>(false);
const storeout = derived([enabled, store], ([e, v]) => {
    return e ? v : {};
});
export default {
    subscribe: (cb: Subscriber<Record<number, Cell>>): Unsubscriber => storeout.subscribe(cb),
    add: (key: number, cell: Cell) => {
        store.update((v) => {
            const n = { ...v };
            n[key] = cell;
            return n;
        });
    },
    remove: (key: number) => {
        store.update((v) => {
            const n = { ...v };
            delete n[key];
            return n;
        });
    },
    enable: () => enabled.set(true),
    disable: () => enabled.set(false)
};
