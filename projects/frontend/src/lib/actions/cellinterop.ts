import type { Cell } from '$lib/chess/Cell';

type Action = { destroy: () => void };

export default function (cell: Cell): (div: HTMLDivElement) => Action {
    function action(div: HTMLDivElement): Action {
        function getcellidresp(ev: CustomEvent) {
            const event = new CustomEvent('piecedragconfirm', {
                detail: { from: cell, to: ev.detail.to }
            });
            ev.detail.target.dispatchEvent(event);
        }

        function getcellid(ev: CustomEvent) {
            const event = new CustomEvent('getcellidresp', {
                bubbles: true,
                detail: { to: cell, target: div }
            });
            ev.detail.target.dispatchEvent(event);
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
