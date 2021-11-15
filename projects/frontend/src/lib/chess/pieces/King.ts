import type { PieceGetter, CellBoundCheck } from '$lib/chess/Piece';
import { Piece } from '$lib/chess/Piece';

export default class King extends Piece {
	constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
		super('K', team, isCellInBound, pieceGetter);
	}

	getPossibleMoves(r: number, f: number): [number, number][] {
		return [].concat(
			// rank/file
			this.moves(r, f, 1, 0, false),
			this.moves(r, f, -1, 0, false),
			this.moves(r, f, 0, 1, false),
			this.moves(r, f, 0, -1, false),

			// diagonal
			this.moves(r, f, 1, 1, false),
			this.moves(r, f, -1, 1, false),
			this.moves(r, f, 1, -1, false),
			this.moves(r, f, -1, -1, false)
		);
	}

	getSupportingMoves(r: number, f: number): [number, number][] {
		return [].concat(
			// rank/file
			this.moves(r, f, 1, 0, true),
			this.moves(r, f, -1, 0, true),
			this.moves(r, f, 0, 1, true),
			this.moves(r, f, 0, -1, true),

			// diagonal
			this.moves(r, f, 1, 1, true),
			this.moves(r, f, -1, 1, true),
			this.moves(r, f, 1, -1, true),
			this.moves(r, f, -1, -1, true)
		);
	}

	moves(r: number, f: number, rinc: number, finc: number, supporting: boolean): [number, number][] {
		const retval: [number, number][] = [];
		const rank = r + rinc;
		const file = f + finc;
		if (this.isCellInBound(rank, file)) {
			const piece = this.pieceGetter(rank, file);
			if (piece == null) {
				retval.push([rank, file]);
			} else if (supporting && piece.team === this.team) {
				retval.push([rank, file]);
			} else if (!supporting && piece.team !== this.team) {
				retval.push([rank, file]);
			}
		}

		return retval;
	}
}
