export abstract class IMove {
    abstract execute(): boolean;
    abstract revert(): boolean;

    abstract prenext(): void;
    abstract revertprenext(): void;
}

export class Move implements IMove {
    _exec: () => boolean;
    _revt: () => boolean;
    _pnxt: () => void;
    _rpxt: () => void;

    constructor({
        execute,
        revert,
        prenext,
        revertprenext
    }: {
        execute: () => boolean;
        revert: () => boolean;
        prenext: () => void;
        revertprenext: () => void;
    }) {
        this._exec = execute;
        this._revt = revert;
        this._pnxt = prenext;
        this._rpxt = revertprenext;
    }
    execute(): boolean {
        return this._exec();
    }
    revert(): boolean {
        return this._revt();
    }

    prenext(): void {
        this._pnxt();
    }

    revertprenext(): void {
        this._rpxt();
    }
}

export class GroupMove implements IMove {
    moves: IMove[];

    constructor() {
        this.moves = [];
    }

    add(move: IMove): void {
        this.moves.push(move);
    }

    execute() {
        this.moves.forEach((m) => m.execute());
        return true;
    }

    revert() {
        this.moves.forEach((m) => m.revert());
        return true;
    }

    prenext() {
        this.moves.forEach((m) => m.prenext());
        return true;
    }

    revertprenext() {
        this.moves.forEach((m) => m.revertprenext());
        return true;
    }
}
