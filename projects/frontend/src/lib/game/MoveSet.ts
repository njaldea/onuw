import type { IMove } from '$lib/game/IMove';

export class MoveSet {
    private done: IMove[];
    private todo: IMove[];

    public constructor() {
        this.done = [];
        this.todo = [];
    }

    public push(move: IMove) {
        this.todo = [];
        this.todo.push(move);
    }

    public next(): boolean {
        if (this.todo.length > 0) {
            if (this.done.length > 0) {
                this.done[this.done.length - 1].prenext();
            }

            const move = this.todo.pop();
            this.done.push(move);

            return move.execute();
        }
        return false;
    }

    public prev(): boolean {
        if (this.done.length > 0) {
            const move = this.done.pop();
            this.todo.push(move);

            const result = move.revert();

            if (this.done.length > 0) {
                this.done[this.done.length - 1].revertprenext();
            }

            return result;
        }
        return false;
    }
}
