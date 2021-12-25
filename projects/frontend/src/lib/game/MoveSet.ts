import type { IMove } from '$lib/game/IMove';

export class MoveSet {
    _done: IMove[];
    _todo: IMove[];

    constructor() {
        this._done = [];
        this._todo = [];
    }

    push(move: IMove) {
        this._todo = [];
        this._todo.push(move);
    }

    next(): boolean {
        if (this._todo.length > 0) {
            if (this._done.length > 0) {
                this._done[this._done.length - 1].prenext();
            }

            const move = this._todo.pop();
            this._done.push(move);

            return move.execute();
        }
        return false;
    }

    prev(): boolean {
        if (this._done.length > 0) {
            const move = this._done.pop();
            this._todo.push(move);

            const result = move.revert();

            if (this._done.length > 0) {
                this._done[this._done.length - 1].revertprenext();
            }

            return result;
        }
        return false;
    }
}
