let ws: WebSocket;

const cbs = {};

async function connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ws = new WebSocket(url);
        ws.onopen = (e) => {
            resolve();
        };
        ws.onmessage = (e) => {
            console.log(e.data);
            const msg = JSON.parse(e.data);
            if (msg.type in cbs) {
                cbs[msg.type](msg);
            }
        };
        ws.onclose = async (e) => {
            ws = null;
            reject();
        };
    });
}

function on(type: number, cb: (arg: any) => void) {
    cbs[type] = cb;
}

function send(message) {
    if (ws != null && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
}

export default {
    connect,
    on,
    send
};
