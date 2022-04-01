import Worker from './_worker.ts?worker';

export async function request() {
    const worker = await new Worker();

    return new Promise<string>((resolve, reject) => {
        function handle(event: MessageEvent<any>) {
            worker.terminate();
            resolve(event.data);
        }

        worker.addEventListener('message', handle);
        worker.postMessage("request");
    });
}
