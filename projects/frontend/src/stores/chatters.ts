import { writable } from 'svelte/store';
import wschatters from '$lib/ws-chatters';

const chatters = writable<string[]>([]);

wschatters.on(1, (arg) => {
	chatters.set(arg.chatters);
});

export default {
	subscribe: (cb) => chatters.subscribe(cb),
	add: (chatter: string) => {
		wschatters.send({ type: 2, chatter });
	},
	remove: (chatter: string) => {
		wschatters.send({ type: 3, chatter });
	}
};
