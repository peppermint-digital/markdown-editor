import { defineConfig } from 'tsup';

export default defineConfig([
    // Core (framework-agnostic)
    {
        entry: { index: 'src/core/index.ts' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/core',
        treeshake: true,
    },
    // React wrapper
    {
        entry: { index: 'src/react/index.tsx' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/react',
        external: [
            'react',
            'react-dom',
            'react-markdown',
            'remark-gfm',
            'lucide-react',
            // Lazy-loaded CodeMirror/Vim entry — resolved by the consumer at
            // runtime only when `vim` is enabled, so it stays out of this bundle.
            '@peppermint-digital/markdown-editor/react-vim',
        ],
        treeshake: true,
    },
    // React Vim editor (CodeMirror 6) — separate entry so it can be lazy-loaded.
    {
        entry: { index: 'src/react/vim-editor.tsx' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/react-vim',
        // React stays external; CodeMirror is bundled in so the chunk is
        // self-contained and consumers don't need to install CM themselves.
        external: ['react', 'react-dom'],
        treeshake: true,
    },
    // Vue wrapper
    {
        entry: { index: 'src/vue/index.ts' },
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        outDir: 'dist/vue',
        external: ['vue', 'lucide-vue-next', 'markdown-it'],
        treeshake: true,
    },
]);
