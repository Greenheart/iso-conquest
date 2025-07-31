<script lang="ts">
    import { scale } from 'svelte/transition'
    import type { Snippet } from 'svelte'

    interface Props {
        header?: Snippet
        children?: Snippet
        footer?: Snippet
        class?: string
    }

    let { class: className, header, children, footer }: Props = $props()
</script>

<div
    class="bg-opacity-30 pointer-events-none fixed top-0 left-0 z-40 h-full w-full bg-black"
></div>

<div
    class={[
        'absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform-gpu bg-stone-700 shadow-2xl',
        className,
    ]}
    role="dialog"
    aria-modal="true"
    in:scale
>
    {@render header?.()}
    {@render children?.()}
    {@render footer?.()}
</div>
