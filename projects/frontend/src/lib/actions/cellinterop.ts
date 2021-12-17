import type { Cell } from '$lib/game/Cell';

type Action = { destroy: () => void };

export default function (cell: Cell): (div: HTMLDivElement) => Action {
    function action(div: HTMLDivElement): Action {
        function getcellid(ev: CustomEvent) {
            const event = new CustomEvent('getcellidresp', {
                detail: { to: cell, target: div }
            });
            ev.detail.target.dispatchEvent(event);
        }

        function getcellidresp(ev: CustomEvent) {
            const event = new CustomEvent('piecedragconfirm', {
                detail: { from: cell, to: ev.detail.to }
            });
            div.dispatchEvent(event);
        }

        div.addEventListener('getcellid', getcellid);
        div.addEventListener('getcellidresp', getcellidresp);

        return {
            destroy: () => {
                div.removeEventListener('getcellid', getcellid);
                div.removeEventListener('getcellidresp', getcellidresp);
            }
        };
    }
    return action;
}
