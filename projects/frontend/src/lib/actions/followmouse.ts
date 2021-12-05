import { spring } from 'svelte/motion';

type Action = { destroy: () => void };

export default function action(div: HTMLDivElement): Action {
    let offsetX = 0;
    let offsetY = 0;

    const opts = { stiffness: 0.2, damping: 0.4 };
    const offset = spring({ x: 0, y: 0 }, opts);

    let lastX = 0;
    let lastY = 0;

    const motionUnsub = offset.subscribe((offset) => {
        const rect = div.getBoundingClientRect();
        div.style.transform = `translate(${offset.x}px, ${offset.y - rect.height - 10}px)`;
    });

    function move(ev: MouseEvent) {
        offsetX += ev.clientX - lastX;
        offsetY += ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        offset.set({ x: offsetX, y: offsetY });
    }

    window.addEventListener('mousemove', move);

    return {
        destroy: () => {
            motionUnsub();
            div.removeEventListener('mousemove', move);
        }
    };
}
