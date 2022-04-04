import Worker from './_worker.ts?worker';

export async function request(modules: string[]) {
    const worker = await new Worker();

    return new Promise<string>((resolve, reject) => {
        worker.addEventListener('message', (event) => resolve(event.data));
        worker.postMessage({
            tags: modules,
            prefix: 'onuw/',
            assets: 'assets/components/'
        });
    });
}
