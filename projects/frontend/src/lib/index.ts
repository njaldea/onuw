import Chess from '$lib/components/Chess.svelte';

class ChessComponent {
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

export default ChessComponent;
