/// <reference types="@sveltejs/kit" />

declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        piecedragconfirm?: (event: any) => any;
    }
}
