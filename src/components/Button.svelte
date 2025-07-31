<script lang="ts" context="module">
    const variants = {
        primary: 'bg-emerald-500 text-white',
        secondary: 'bg-stone-400 text-black',
        danger: 'bg-red-700 text-white',
    }

    export type ButtonProps = {
        onClick: () => void
        label: string
        variant?: keyof typeof variants
        autofocus?: boolean
    }
</script>

<script lang="ts">
    export let variant: ButtonProps['variant']
    export let onClick: ButtonProps['onClick']
    export let label: ButtonProps['label']
    export let autofocus: ButtonProps['autofocus']
</script>

<!-- svelte-ignore a11y-autofocus -->
<button
    {autofocus}
    class={'transform-gpu px-12 py-4 text-xl font-semibold duration-100 hover:scale-105 ' +
        variants[variant ?? 'primary']}
    on:click={onClick}
>
    {label}
</button>
