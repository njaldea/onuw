import Chess from './package/components/Chess.svelte'

export default {
    create: (target, props) =>
    {
        return new Chess({
            target: target,
            props: {
                flipped: props?.flipped || false
            }
        });
    }
};
