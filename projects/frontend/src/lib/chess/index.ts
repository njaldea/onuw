import type { GameDetail } from './Piece';
import { Player } from './Player';
import { Cell } from './Cell';

export function getCells(): {
    dimension: [number, number];
    cells: Cell[];
    players: [Player, Player];
} {
    const rcount = 8;
    const ccount = 8;

    const cells: Cell[] = [];
    for (let r = 0; r < rcount; ++r) {
        for (let c = 0; c < ccount; ++c) {
            cells.push(new Cell(r * ccount + c, [r, c]));
        }
    }

    const gamedetail: GameDetail = {
        cell: {
            inbound: (r, f) => 0 <= r && r < rcount && 0 <= f && f < ccount,
            supporters: (r, f) =>
                cells[r * ccount + f].coveredby.map((id) => [Math.floor(id / ccount), id % ccount]),
            touched: (r, f) => cells[r * ccount + f].touched
        },
        piece: (r, f) => cells[r * ccount + f].piece,
        move: (fromPos: [number, number], toPos: [number, number]) => {
            const from = cells[fromPos[0] * ccount + fromPos[1]];
            const to = cells[toPos[0] * ccount + toPos[1]];

            const prevstate = {
                to: to,
                from: from,
                topiece: to.piece,
                frompiece: from.piece,
                totouched: to.touched,
                fromtouched: from.touched
            };

            const nextstate = {
                to: to,
                from: from,
                topiece: from.piece,
                frompiece: null,
                totouched: true,
                fromtouched: true
            };

            return {
                revert: () => {
                    prevstate.to.piece = prevstate.topiece;
                    prevstate.to.touched = prevstate.totouched;
                    prevstate.from.piece = prevstate.frompiece;
                    prevstate.from.touched = prevstate.fromtouched;
                    return true;
                },
                execute: () => {
                    nextstate.to.piece = nextstate.topiece;
                    nextstate.to.touched = nextstate.totouched;
                    nextstate.from.piece = nextstate.frompiece;
                    nextstate.from.touched = nextstate.fromtouched;
                    return true;
                }
            };
        }
    };

    function fill(p: Player, cells: Cell[]) {
        const order = [
            p.rook,
            p.knight,
            p.bishop,
            p.king.team ? p.king : p.queen,
            p.king.team ? p.queen : p.king,
            p.bishop,
            p.knight,
            p.rook,
            p.pawn,
            p.pawn,
            p.pawn,
            p.pawn,
            p.pawn,
            p.pawn,
            p.pawn,
            p.pawn
        ];

        const start = p.king.team ? 0 : cells.length - order.length;
        const end = p.king.team ? order.length : cells.length;
        const cc = cells.slice(start, end);
        if (!p.king.team) {
            cc.reverse();
        }

        for (let index = 0; index < order.length; ++index) {
            cc[index].piece = order[index];
        }
    }

    const p1 = new Player(true, gamedetail);
    fill(p1, cells);

    const p2 = new Player(false, gamedetail);
    fill(p2, cells);

    return { dimension: [rcount, ccount], cells, players: [p1, p2] };
}
