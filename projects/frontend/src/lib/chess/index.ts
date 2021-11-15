import type { CellBoundCheck, PieceGetter } from "./Piece";
import type { Player } from "./Player";
import { Player8x8 } from "./Player";
import { Cell } from "./Cell";

export function getCells(): {
	dimension: [number, number];
	cells: Cell[];
	teams: [Player, Player];
} {	
	const rcount = 8;
	const ccount = 8;
	
	const cells: Cell[] = [];
	for (let r = 0; r < rcount; ++r) {
		for (let c = 0; c < ccount; ++c) {
			cells.push(new Cell(r * rcount + c, [r, c]));
		}
	}

	const pieceGetter: PieceGetter = (r: number, f: number) => {
		if (r < rcount && f < ccount) {
			return cells[r * rcount + f].piece;
		}
		return null;
	};

	const isCellInBound: CellBoundCheck = (r: number, f: number) => {
		return 0 <= r && r < rcount && 0 <= f && f < ccount;
	};

	const p1 = new Player8x8(true, isCellInBound, pieceGetter);
	p1.populateDefault();
	p1.fillDefault(cells);

	const p2 = new Player8x8(false, isCellInBound, pieceGetter);
	p2.populateDefault();
	p2.fillDefault(cells);

	return { dimension: [rcount, ccount], cells, teams: [p1, p2] };
}
