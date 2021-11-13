import type { Piece, CellDetail } from "./types/Chess";

export function getPiece(rank: number, file: number): null|Piece {
    if (rank === 0 || rank === 7) {
        if (file === 0 || file === 7) {
            return { role: "R", team: rank === 0, getPossibleMoves: (r, f) => [] };
        }
        if (file === 1 || file === 6) {
            return { role: "N", team: rank === 0, getPossibleMoves: (r, f) => [] };
        }
        if (file === 2 || file === 5) {
            return { role: "B", team: rank === 0, getPossibleMoves: (r, f) => [] };
        }
        if (file === 3) {
            return { role: "Q", team: rank === 0, getPossibleMoves: (r, f) => [] };
        }
        if (file === 4) {
            return { role: "K", team: rank === 0, getPossibleMoves: (r, f) => [] };
        }
    }
    if (rank === 1 || rank === 6) {
        return {
            role: "P",
            team: rank === 1,
            getPossibleMoves: function (r, f)
            {
                if (this.team)
                {
                    if (r !== 0)
                    {
                        return [[ r + 1, f ]];
                    }
                }
                else
                {
                    if (r !== 7)
                    {
                        return [[ r - 1, f ]];
                    }
                }
                return [];
            }
        };
    }
    return null;
}

export function getCells()
{
    const cells: CellDetail[] = [];

    const rcount = 8;
    const ccount = 8;
    for (let r = 0; r < rcount; ++r)
    {
        for (let c = 0; c < ccount; ++c)
        {
            cells.push({
                id: (r * 8) + c,
                piece: getPiece(r, c),
                position: [r, c],
                targeted: false
            });
        }
    }
    return { dimension: [8, 8], cells };
}

export function getTileColor(r: number, c: number, flipped: boolean) {
    type Callable = () => string;
    const get = (i: number, p: Callable, s: Callable) => i % 2 === 0 ? p() : s();
    const cb1 = () => get(c, () => "white", () => "black");
    const cb2 = () => get(c, () => "black", () => "white");
    return get(
        r,
        flipped ? cb2 : cb1,
        flipped ? cb1 : cb2
    );
}
