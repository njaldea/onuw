import Chess from '$lib/components/Module.svelte';

// this is to hide internal type to consumers.
class Impl {
    flipped: boolean;
    component: Chess;

    public constructor(target: HTMLDivElement, props: { flipped?: boolean }) {
        this.flipped = props?.flipped || false;
        this.component = new Chess({
            target: target,
            props: { flipped: this.flipped }
        });
    }

    public flip() {
        this.flipped = !this.flipped;
        this.component.$set({ flipped: this.flipped });
    }
}

class ChessComponent {
    private impl: Impl;
    public constructor(target: HTMLDivElement, props: { flipped?: boolean }) {
        this.impl = new Impl(target, props);
    }

    public flip() {
        this.impl.flip();
    }
}

export default ChessComponent;
