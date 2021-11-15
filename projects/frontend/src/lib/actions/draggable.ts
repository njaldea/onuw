
import type { Piece } from '$lib/chess/Piece';
import { spring } from 'svelte/motion';

type Action = { destroy: () => void };

export default function (
    onstart: () => void,
    onend: (origin: HTMLDivElement, candidates: Element[]) => void
): (div: HTMLDivElement, { piece }: { piece: Piece }) => Action {
    let offsetX = 0;
    let offsetY = 0;

    const opts = { stiffness: 0.2, damping: 0.4 };
    const offset = spring({ x: 0, y: 0 }, opts);

    function action(div: HTMLDivElement, { piece }: { piece: Piece }): Action {
        let lastX: number;
        let lastY: number;

        const motionUnsub = offset.subscribe((offset) => {
            div.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
            const isNotMoving = offset.x === 0 && offset.y === 0;
            div.style.zIndex = isNotMoving ? '0' : '1';
        });
        let track = false;

        function move(ev: MouseEvent) {
            if (piece === null) return;
            if (track === true) {
                offsetX += ev.clientX - lastX;
                offsetY += ev.clientY - lastY;
                lastX = ev.clientX;
                lastY = ev.clientY;
                offset.set({ x: offsetX, y: offsetY });
            }
        }

        window.addEventListener('mousemove', move);

        function start(ev: MouseEvent) {
            if (piece === null) return;
            if (track === true) return;
            track = true;

            lastX = ev.clientX;
            lastY = ev.clientY;

            onstart();
        }

        function end() {
            if (piece === null) return;
            if (track === false) return;
            track = false;

            offsetX = 0;
            offsetY = 0;
            offset.set({ x: 0, y: 0 });

            const rect = div.getBoundingClientRect();
            const midX = rect.x + rect.width / 2;
            const midY = rect.y + rect.height / 2;
            const candidates = document.elementsFromPoint(midX, midY);
            onend(div, candidates);
        }

        div.addEventListener('mousedown', start);
        div.addEventListener('mouseup', end);

        return {
            destroy: () => {
                motionUnsub();
                window.removeEventListener('mousemove', move);
                div.removeEventListener('mousedown', start);
                div.removeEventListener('mouseup', end);
            }
        };
    }

    return action;
}
