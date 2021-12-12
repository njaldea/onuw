import type { Move } from './Detail';

export class MoveSet {
    done: Move[];
    todo: Move[];

    constructor() {
        this.done = [];
        this.todo = [];
    }

    push(move: Move) {
        this.todo = [];
        this.todo.push(move);
    }

    next(): boolean {
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

    prev(): boolean {
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
