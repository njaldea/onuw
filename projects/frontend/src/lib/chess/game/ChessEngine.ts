import { IBoard, Board } from '../Board';
import { Cell, Cells } from '../Cell';
import { Player } from '../Player';
import { BasicGame } from './Basic';
import { fill } from '../setup';
import type { Detail } from './Detail';
import type { Subscriber } from 'svelte/store';

import { MoveSet } from './MoveSet';
import type { Engine } from './Engine';

export class ChessEngine implements Engine {
    players: [Player, Player];
    board: IBoard;

    rcount: number;
    ccount: number;
    moves: MoveSet;

    teamtomove: boolean;

    constructor() {
        this.teamtomove = true;
        this.rcount = 8;
        this.ccount = 8;

        const cells = new Cells(this.rcount, this.ccount);
        const gamedetail: Detail = new BasicGame(cells);

        this.players = [new Player(true, gamedetail), new Player(false, gamedetail)];
        this.players.forEach((p) => fill(p, cells));
        this.board = new Board(this.players, cells);

        this.moves = new MoveSet();
    }

    next(): void {
        if (this.moves.next()) {
            this.teamtomove = !this.teamtomove;
        }
    }

    prev(): void {
        if (this.moves.prev()) {
            this.teamtomove = !this.teamtomove;
        }
    }

    movestart(cell: Cell) {
        if (cell.piece && this.teamtomove === cell.piece.team) {
            this.board.setTargetedMarkings(cell);
        }
    }

    movecancel() {
        this.board.clearTargetedMarkings();
    }

    moveconfirm(from: Cell, to: Cell) {
        if (from.piece && this.teamtomove === from.piece.team) {
            if (to.targeted) {
                const move = this.board.move(from, to);
                if (move) {
                    this.moves.push(move);
                    this.next();
                }
            }
        }

        this.board.clearTargetedMarkings();
    }

    subscribe(cb: Subscriber<IBoard>) {
        return this.board.subscribe(cb);
    }

    dimension(): [number, number] {
        return [this.rcount, this.ccount];
    }
}
