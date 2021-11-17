import type { CellBoundCheck, PieceGetter } from './Piece';
import type { Player } from './Player';
import { ChessPlayer } from './Player';
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

    const p1 = new ChessPlayer(true, isCellInBound, pieceGetter);
    p1.populateDefault();
    p1.fillDefault(cells);

    const p2 = new ChessPlayer(false, isCellInBound, pieceGetter);
    p2.populateDefault();
    p2.fillDefault(cells);

    return { dimension: [rcount, ccount], cells, players: [p1, p2] };
}
