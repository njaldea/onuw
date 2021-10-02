import { config } from 'dotenv';
import { default as findconfig } from 'find-config';
import { WebSocketServer } from 'ws';

config({ path: findconfig('.env') });
const wss = new WebSocketServer({ port: process.env.ONUW_CHATTERS_PORT });

const chatters = {};

function sendChatters() {
    for (const key in chatters) {
        chatters[key].send(JSON.stringify({ type: 1, chatters: Object.keys(chatters) }));
    }
}

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log('received: %s', message);
        const m = JSON.parse(message);
        if (m.type === 2) {
            if (!(m.chatter in chatters)) {
                chatters[m.chatter] = ws;
                sendChatters();
            }
        } else if (m.type === 3) {
            if (m.chatter in chatters) {
                delete chatters[m.chatter];
                sendChatters();
            }
        }
    });
    ws.on('close', function close() {
        for (const key in chatters) {
            if (chatters[key] === ws) {
                delete chatters[key];
                break;
            }
        }
        sendChatters();
    });
});
