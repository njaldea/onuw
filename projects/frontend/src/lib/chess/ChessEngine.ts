import { Cells } from '$lib/game/Cells';
import { fill } from '$lib/chess/setup';
import { Player } from '$lib/chess/Player';
import { BoardPieceBridge } from '$lib/chess/BoardPieceBridge';

import type { Cell } from '$lib/game/Cell';
import type { IBoardPieceBridge } from '$lib/game/IBoardPieceBridge';

import { MoveSet } from '$lib/game/MoveSet';
import { Engine } from '$lib/game/Engine';

export class ChessEngine extends Engine {
    private players: [Player, Player];

    private rcount: number;
    private ccount: number;
    private moves: MoveSet;

    private teamtomove: boolean;

    public constructor() {
        const rcount = 8;
        const ccount = 8;
        const cells = new Cells(rcount, ccount);
        super(cells);

        this.teamtomove = true;
        this.rcount = rcount;
        this.ccount = ccount;
        this.moves = new MoveSet();

        const gamedetail: IBoardPieceBridge = new BoardPieceBridge(cells);

        this.players = [new Player(true, gamedetail), new Player(false, gamedetail)];
        this.players.forEach((p) => fill(p, cells));

        cells.resetCellStates();
    }

    override next(): void {
        if (this.moves.next()) {
            this.teamtomove = !this.teamtomove;
        }
    }

    override prev(): void {
        if (this.moves.prev()) {
            this.teamtomove = !this.teamtomove;
        }
    }

    override movestart(cell: Cell) {
        if (cell.piece && this.teamtomove === cell.piece.team) {
            this.setTargetedMarkings(cell);
        }
    }

    override movecancel() {
        this.clearTargetedMarkings();
    }

    override moveconfirm(from: Cell, to: Cell) {
        if (from.piece && this.teamtomove === from.piece.team) {
            if (to.targeted) {
                const move = this.move(from, to);
                if (move) {
                    this.moves.push(move);
                    this.next();
                }
            }
        }

        this.clearTargetedMarkings();
    }

    override dimension(): [number, number] {
        return [this.rcount, this.ccount];
    }

    override isMoveValid(from: Cell, to: Cell): boolean {
        const isInOrder = (c1: Cell, c2: Cell, c3: Cell): boolean => {
            if (
                (c2.position[1] - c1.position[1]) * (c3.position[0] - c1.position[0]) ===
                (c2.position[0] - c1.position[0]) * (c3.position[1] - c1.position[1])
            ) {
                const sqr = (p: number) => p * p;
                const distance = (p1: [number, number], p2: [number, number]) =>
                    sqr(p1[0] - p2[0]) + sqr(p1[1] - p2[1]);
                const d1 = distance(c1.position, c2.position);
                const d2 = distance(c2.position, c3.position);
                const d3 = distance(c1.position, c3.position);
                return d3 > d1 && d3 > d2;
            }
            return false;
        };

        const cells = [...this.cells(false)];

        const kingcell = cells.filter(
            (c) => c.piece && c.piece.role === 'K' && c.piece.team === from.piece.team
        )[0];

        if (kingcell.id === from.id) {
            return true;
        } else if (kingcell.attackedby.length === 0) {
            if (from.attackedby.length > 0) {
                const pieceattackers = from.attackedby
                    .map((id) => cells[id])
                    .filter((a) => a.piece && !['P', 'K', 'N'].includes(a.piece.role));
                for (const attacker of pieceattackers) {
                    if (isInOrder(kingcell, from, attacker)) {
                        return attacker === to || isInOrder(kingcell, to, attacker);
                    }
                }
            }
            return true;
        } else if (kingcell.attackedby.length === 1) {
            const attacker = cells[kingcell.attackedby[0]];
            return attacker === to || isInOrder(kingcell, to, attacker);
        } else {
            return false;
        }
    }
}
