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
        });

        function move(ev: MouseEvent) {
            offsetX += ev.clientX - lastX;
            offsetY += ev.clientY - lastY;
            lastX = ev.clientX;
            lastY = ev.clientY;
            offset.set({ x: offsetX, y: offsetY });
        }

        let subscribed = false;

        function start(ev: MouseEvent) {
            if (piece === null) return;

            lastX = ev.clientX;
            lastY = ev.clientY;

            onstart();

            if (!subscribed) {
                subscribed = true;
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', end);
            }
        }

        function end() {
            offsetX = 0;
            offsetY = 0;
            offset.set({ x: 0, y: 0 });

            const rect = div.getBoundingClientRect();
            const midX = rect.x + rect.width / 2;
            const midY = rect.y + rect.height / 2;
            const candidates = document.elementsFromPoint(midX, midY);
            onend(div, candidates);

            if (subscribed) {
                subscribed = false;
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', end);
            }
        }

        div.addEventListener('mousedown', start);

        return {
            destroy: () => {
                motionUnsub();
                div.removeEventListener('mousedown', start);
                if (subscribed) {
                    subscribed = false;
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', end);
                }
            }
        };
    }

    return action;
}
