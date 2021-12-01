import type { GameDetail } from './Piece';
import { Player } from './Player';
import { Cells } from './Cell';
import type { Cell } from './Cell';

export function getCells(): {
    dimension: [number, number];
    cells: Cells;
    players: [Player, Player];
} {
    const rcount = 8;
    const ccount = 8;

    const cells = new Cells(8, 8);

    const gamedetail: GameDetail = {
        cell: {
            inbound: (r, f) => cells.isValidTile(r, f),
            supporters: (r, f) => cells.getCell(r, f)?.coveredby ?? [],
            touched: (r, f) => cells.getCell(r, f)?.touched ?? false
        },
        piece: (r, f) => cells.getCell(r, f)?.piece,
        move: (fromPos: [number, number], toPos: [number, number]) => {
            const from = cells.getCell(...fromPos);
            const to = cells.getCell(...toPos);

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

    function fill(p: Player, cells: Cells) {
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

        const cellgen = cells.iter(!p.king.team);

        for (let index = 0; index < order.length; ++index) {
            const cell: Cell = cellgen.next().value;
            cell.piece = order[index];
        }
    }

    const p1 = new Player(true, gamedetail);
    fill(p1, cells);

    const p2 = new Player(false, gamedetail);
    fill(p2, cells);

    return { dimension: [rcount, ccount], cells, players: [p1, p2] };
}
