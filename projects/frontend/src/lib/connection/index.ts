export class Connection {
    private ws: null | WebSocket;
    private cbs: Record<number, (arg: unknown) => void>;

    public constructor() {
        this.ws = null;
        this.cbs = {};
    }

    public send(message: unknown) {
        if (this.connected()) {
            this.ws.send(JSON.stringify(message));
        }
    }

    public on(type: number, cb: (arg: unknown) => void) {
        this.cbs[type] = cb;
    }

    public async connect(url: string) {
        return new Promise<void>((resolve, reject) => {
            this.ws = new WebSocket(url);
            this.ws.onopen = () => resolve();
            this.ws.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                if (msg.type in this.cbs) {
                    this.cbs[msg.type](msg);
                }
            };
            this.ws.onclose = async () => {
                this.ws = null;
                reject();
            };
        });
    }

    public connected() {
        return this.ws != null && this.ws.readyState === WebSocket.OPEN;
    }
}
