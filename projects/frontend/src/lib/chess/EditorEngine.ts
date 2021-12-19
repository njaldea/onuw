import { Cells } from '$lib/game/Cells';
import { fill } from '$lib/chess/setup';
import { Player } from '$lib/chess/Player';
import { BoardPieceBridge } from '$lib/chess/BoardPieceBridge';

import type { Cell } from '$lib/game/Cell';
import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';

import { MoveSet } from '$lib/game/MoveSet';
import { Observable } from '$lib/game/Engine';
import { Piece, TemplatePiece } from '$lib/game/Piece';
import { IMove, Move } from '$lib/game/IMove';
import { IEngine } from '$lib/game/IEngine';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export class EditorEngine extends IEngine {
    players: [Player, Player];

    rcount: number;
    ccount: number;
    moves: MoveSet;

    factories: Cells;
    #observable: Observable<IEngine>

    #cells: Cells;
    #templates: Cells;
    templates: Cells;

    constructor() {
        super();

        const rcount = 8;
        const ccount = 8;
        this.#cells = new Cells(rcount, ccount);
        this.#templates = new Cells(2, 5);
        this.templates = this.#templates;

        this.#observable = new Observable<IEngine>(this);

        this.rcount = rcount;
        this.ccount = ccount;
        this.moves = new MoveSet();

        // this one needs to be bypassed
        const gamedetail: IBoardPieceBridge = new BoardPieceBridge(this.#cells);

        this.players = [new Player(true, gamedetail), new Player(false, gamedetail)];
        this.players.forEach((p) => fill(p, this.#cells));

        const factorycells = [...this.#templates.iter()];
        const mover = (piece: Piece, from: [number, number], to: [number, number]): IMove => {
            const toCell = this.#cells.getCell(...to);
    
            const prevstate = {
                to: toCell,
                topiece: toCell.piece,
            };
    
            const nextstate = {
                to: toCell,
                topiece: piece,
            };
    
            return new Move({
                revert: () => {
                    prevstate.to.piece = prevstate.topiece;
                    return true;
                },
                execute: () => {
                    nextstate.to.piece = nextstate.topiece;
                    return true;
                },
                prenext: () => undefined,
                revertprenext: () => undefined
            });
        };
        factorycells[0].piece = new TemplatePiece(this.players[0].queen, mover);
        factorycells[1].piece = new TemplatePiece(this.players[0].rook, mover);
        factorycells[2].piece = new TemplatePiece(this.players[0].bishop, mover);
        factorycells[3].piece = new TemplatePiece(this.players[0].knight, mover);
        factorycells[4].piece = new TemplatePiece(this.players[0].pawn, mover);
        factorycells[5].piece = new TemplatePiece(this.players[1].queen, mover);
        factorycells[6].piece = new TemplatePiece(this.players[1].rook, mover);
        factorycells[7].piece = new TemplatePiece(this.players[1].bishop, mover);
        factorycells[8].piece = new TemplatePiece(this.players[1].knight, mover);
        factorycells[9].piece = new TemplatePiece(this.players[1].pawn, mover);

        this.#cells.resetCellStates();
    }

    *cells(reverse: boolean): Generator<Cell> {
        yield* this.#cells.iter(reverse);
    }

    subscribe(cb: Subscriber<IEngine>): Unsubscriber {
        return this.#observable.subscribe(cb);
    }

    next(): void {
        this.moves.next();
    }

    prev(): void {
        this.moves.prev();
    }

    movestart(cell: Cell) {
        // do nothing
    }

    movecancel() {
        // do nothing
    }

    moveconfirm(from: Cell, to: Cell) {
        if (from.piece) {
            const move = this._move(from, to);
            if (move) {
                this.moves.push(move);
                this.next();
            }
        }
    }

    _move(from: Cell, to: Cell): null | IMove {
        const move = from.piece.move(from.position, to.position);
        if (move) {
            return new Move({
                execute: () => {
                    const ret = move.execute();
                    this.#observable.notify();
                    return ret;
                },
                revert: () => {
                    const ret = move.revert();
                    this.#observable.notify();
                    return ret;
                },
                prenext: () => {
                    move.prenext();
                    this.#observable.notify();
                },
                revertprenext: () => {
                    move.revertprenext();
                    this.#observable.notify();
                }
            });
        }
        return null;
    }

    dimension(): [number, number] {
        return [this.rcount, this.ccount];
    }
}
