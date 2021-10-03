import { writable } from 'svelte/store';
import wschatters from '$lib/ws-chatters';

interface MessageData {
    name: string;
    message: string;
}

const messages = writable<MessageData[]>([]);

wschatters.on(2, (arg) => {
	messages.update(v => [...v, {name: arg.name, message: arg.message}]);
});

export default {
	subscribe: (cb: (v: MessageData[]) => void) => messages.subscribe(cb),
	send: (name: string, message: string) => {
		wschatters.send({ type: 4, name, message });
	}
};
