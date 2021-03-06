import type { Cell } from '$lib/game/Cell';
import type { Cells } from '$lib/game/Cells';
import type { Player } from '$lib/chess/Player';

export function fill(p: Player, cells: Cells): void {
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
