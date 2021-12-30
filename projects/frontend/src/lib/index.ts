import Module from '$lib/components/Module.svelte';

type Impl = {
    flipped: boolean;
    component: Module;
};

export class Chess {
    /** @internal **/
    private impl: Impl;

    public constructor(target: HTMLDivElement, props: { flipped?: boolean } = {}) {
        const flipped = props?.flipped || false;
        this.impl = {
            flipped,
            component: new Module({
                target: target,
                props: { flipped }
            })
        };
    }

    public flip() {
        const flipped = !this.impl.flipped;
        this.impl.flipped = flipped;
        this.impl.component.$set({ flipped });
    }
}
