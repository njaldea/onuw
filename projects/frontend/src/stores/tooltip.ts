import { derived, writable } from 'svelte/store';

const store = writable<Record<string, unknown>>({});
const enabled = writable<boolean>(false);
const storeout = derived([enabled, store], ([e, v]) => {
    return e ? v : {};
});
export default {
    subscribe: (cb) => storeout.subscribe(cb),
    add: (key, text) => {
        store.update((v) => {
            const n = { ...v };
            n[key] = text;
            return n;
        });
    },
    remove: (key) => {
        store.update((v) => {
            const n = { ...v };
            delete n[key];
            return n;
        });
    },
    enable: () => enabled.set(true),
    disable: () => enabled.set(false)
};
