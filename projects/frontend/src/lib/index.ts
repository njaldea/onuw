import Chess from '$lib/components/Chess.svelte';

// this is to hide internal type to consumers.
class Impl {
    flipped: boolean;
    component: Chess;

    constructor(target, props) {
        this.flipped = props?.flipped || false;
        this.component = new Chess({
            target: target,
            props: { flipped: this.flipped }
        });
    }

    flip() {
        this.flipped = !this.flipped;
        this.component.$set({ flipped: this.flipped });
    }
}

class ChessComponent {
    #impl;
    constructor(target: HTMLDivElement, props: { flipped?: boolean }) {
        this.#impl = new Impl(target, props);
    }

    flip() {
        this.#impl.flip();
    }
}

export default ChessComponent;
