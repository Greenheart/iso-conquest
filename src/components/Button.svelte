<script lang="ts" module>
    const variants = {
        primary: 'bg-emerald-500 text-white',
        secondary: 'bg-stone-400 text-black',
        danger: 'bg-red-700 text-white',
    }

    export type ButtonProps = {
        onclick: () => void
        label: string
        variant?: keyof typeof variants
        autofocus?: boolean
    }
</script>

<script lang="ts">
    let { variant, onclick, label, autofocus }: ButtonProps = $props()
</script>

<!-- svelte-ignore a11y_autofocus -->
<button
    {autofocus}
    class={[
        'transform-gpu px-12 py-4 text-xl font-semibold duration-100 hover:scale-105',
        variants[variant ?? 'primary'],
    ]}
    {onclick}
>
    {label}
</button>
