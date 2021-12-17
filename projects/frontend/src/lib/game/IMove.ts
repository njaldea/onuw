export abstract class IMove {
    abstract execute(): boolean;
    abstract revert(): boolean;

    abstract prenext(): void;
    abstract revertprenext(): void;
}

export class Move implements IMove {
    #exec: () => boolean;
    #revt: () => boolean;
    #pnxt: () => void;
    #rpxt: () => void;

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
        this.#exec = execute;
        this.#revt = revert;
        this.#pnxt = prenext;
        this.#rpxt = revertprenext;
    }
    execute(): boolean {
        return this.#exec();
    }
    revert(): boolean {
        return this.#revt();
    }

    prenext(): void {
        this.#pnxt();
    }

    revertprenext(): void {
        this.#rpxt();
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
