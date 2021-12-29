export abstract class IMove {
    public abstract execute(): boolean;
    public abstract revert(): boolean;

    public abstract prenext(): void;
    public abstract revertprenext(): void;
}

export class Move extends IMove {
    private exec: () => boolean;
    private revt: () => boolean;
    private pnxt: () => void;
    private rpxt: () => void;

    public constructor({
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
        super();
        this.exec = execute;
        this.revt = revert;
        this.pnxt = prenext;
        this.rpxt = revertprenext;
    }

    override execute(): boolean {
        return this.exec();
    }

    override revert(): boolean {
        return this.revt();
    }

    override prenext(): void {
        this.pnxt();
    }

    override revertprenext(): void {
        this.rpxt();
    }
}

export class GroupMove extends IMove {
    private moves: IMove[];

    public constructor() {
        super();
        this.moves = [];
    }

    public add(move: IMove): void {
        this.moves.push(move);
    }

    override execute() {
        this.moves.forEach((m) => m.execute());
        return true;
    }

    override revert() {
        this.moves.forEach((m) => m.revert());
        return true;
    }

    override prenext() {
        this.moves.forEach((m) => m.prenext());
        return true;
    }

    override revertprenext() {
        this.moves.forEach((m) => m.revertprenext());
        return true;
    }
}
