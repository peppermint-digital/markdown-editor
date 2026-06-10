// Ambient type for the lazy-loaded subpath. The runtime module is built to
// dist/react-vim and resolved by consumers via the package "exports" map; this
// declaration lets the react wrapper typecheck without depending on build order.
declare module '@peppermint-digital/markdown-editor/react-vim' {
    const VimEditor: import('react').ForwardRefExoticComponent<
        import('./vim-editor').VimEditorProps &
            import('react').RefAttributes<import('./vim-editor').VimEditorHandle>
    >;
    export default VimEditor;
}
