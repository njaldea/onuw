import { Piece } from '../types/Chess';
import type { PieceGetter, CellBoundCheck } from '../types/Chess';

export default class Pawn extends Piece {
	constructor(team: boolean, isCellInBound: CellBoundCheck, pieceGetter: PieceGetter) {
		super('P', team, isCellInBound, pieceGetter);
	}

	getPossibleMoves(r: number, f: number): [number, number][] {
		const retval: [number, number][] = [];

		const nextCell: [number, number] = this.team ? [r + 1, f] : [r - 1, f];
		if (this.isCellInBound(nextCell[0], nextCell[1])) {
			if (this.pieceGetter(nextCell[0], nextCell[1]) == null) {
				retval.push(nextCell);
			}

			if (this.hasMoved === false && retval.length === 1) {
				const nextNextCell: [number, number] = this.team ? [r + 2, f] : [r - 2, f];
				if (
					this.isCellInBound(nextNextCell[0], nextNextCell[1]) &&
					this.pieceGetter(nextNextCell[0], nextNextCell[1]) == null
				) {
					retval.push(nextNextCell);
				}
			}

			const diagonalCheck = (p: [number, number]) => {
				const piece = this.pieceGetter(p[0], p[1]);
				return piece && piece.team !== this.team;
			};

			this.addCell(retval, this.team ? [r + 1, f + 1] : [r - 1, f + 1], diagonalCheck);
			this.addCell(retval, this.team ? [r + 1, f - 1] : [r - 1, f + 1], diagonalCheck);
		}

		return retval;
	}

	getSupportingMoves(r: number, f: number): [number, number][] {
		const retval: [number, number][] = [];

		this.addCell(retval, this.team ? [r + 1, f + 1] : [r - 1, f + 1], () => true);
		this.addCell(retval, this.team ? [r + 1, f - 1] : [r - 1, f + 1], () => true);

		return retval;
	}

	addCell(
		out: [number, number][],
		[rank, file]: [number, number],
		predicate: (p: [number, number]) => boolean
	) {
		if (this.isCellInBound(rank, file)) {
			if (predicate([rank, file])) {
				out.push([rank, file]);
			}
		}
	}
}
