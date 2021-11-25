import type { CellBoundCheck, PieceGetter } from './Piece';
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

    const pieceGetter: PieceGetter = (r: number, f: number) => {
        if (r < rcount && f < ccount) {
            return cells[r * ccount + f].piece;
        }
        return null;
    };

    const isCellInBound: CellBoundCheck = (r: number, f: number) => {
        return 0 <= r && r < rcount && 0 <= f && f < ccount;
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

    const p1 = new Player(true, isCellInBound, pieceGetter);
    fill(p1, cells);

    const p2 = new Player(false, isCellInBound, pieceGetter);
    fill(p2, cells);

    return { dimension: [rcount, ccount], cells, players: [p1, p2] };
}
