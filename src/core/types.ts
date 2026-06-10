export type ToolbarItem =
    | 'bold'
    | 'italic'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'link'
    | 'code'
    | 'codeblock'
    | 'ul'
    | 'ol'
    | 'quote'
    | 'hr'
    | 'table'
    | 'checklist'
    | 'image'
    | 'preview'
    | 'vim';

export interface MarkdownEditorProps {
    /** Current markdown content */
    value: string;
    /** Callback when content changes */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Additional CSS classes for the container */
    className?: string;
    /** Minimum height of the editor area */
    minHeight?: string;
    /** Preview mode: false (off), true (preview only), 'split' (side by side) */
    preview?: boolean | 'split';
    /** Disable the editor */
    disabled?: boolean;
    /** Toolbar items to show */
    toolbar?: ToolbarItem[];
    /** Custom class for the toolbar */
    toolbarClassName?: string;
    /** Custom class for the textarea */
    textareaClassName?: string;
    /** Custom class for the preview area */
    previewClassName?: string;
    /** Custom class for toolbar buttons */
    buttonClassName?: string;
    /** Custom class for active toolbar buttons */
    buttonActiveClassName?: string;
    /** Callback for image upload - receives File, should return URL */
    onImageUpload?: (file: File) => Promise<string>;
    /** Use shadcn/ui compatible styling */
    variant?: 'default' | 'shadcn';
    /**
     * Initial state of the Vim key bindings toggle. The editor self-manages the
     * live state from here on (toggled via the toolbar `vim` button and persisted
     * to localStorage), so the package stays drop-in for any consumer without
     * backend wiring. When on, the edit surface switches from a plain <textarea>
     * to a CodeMirror 6 editor with Vim mode and Markdown syntax highlighting;
     * toolbar, preview and API are unchanged. CodeMirror is lazy-loaded, so
     * leaving Vim off has zero bundle cost.
     */
    vim?: boolean;
    /**
     * Called whenever the user toggles Vim mode via the toolbar. Lets a consumer
     * additionally sync the choice server-side; persistence to localStorage
     * happens regardless.
     */
    onVimChange?: (enabled: boolean) => void;
    /**
     * localStorage key used to remember the Vim toggle. Override to scope it per
     * app/editor instance. Set to null to disable persistence. Default: "md-editor:vim".
     */
    vimStorageKey?: string | null;
}

/** Framework-agnostic toolbar action config (no icon reference) */
export interface ToolbarActionConfig {
    label: string;
    prefix: string;
    suffix: string;
    block?: boolean;
    shortcut?: string;
    handler?: 'default' | 'image' | 'table';
}

/** Represents the current textarea selection state */
export interface TextareaState {
    value: string;
    selectionStart: number;
    selectionEnd: number;
}

/** Result of a formatting operation */
export interface FormatResult {
    newValue: string;
    cursorStart: number;
    cursorEnd: number;
}
