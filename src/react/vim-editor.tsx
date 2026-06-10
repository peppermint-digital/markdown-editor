import * as React from 'react';
import {
    EditorView,
    keymap,
    lineNumbers,
    drawSelection,
    placeholder as cmPlaceholder,
} from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
    syntaxHighlighting,
    defaultHighlightStyle,
    indentOnInput,
} from '@codemirror/language';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vim } from '@replit/codemirror-vim';

import type { TextareaState, FormatResult } from '../core/types';

/**
 * Imperative API the toolbar uses, so the framework-agnostic `core/` formatting
 * functions work against CodeMirror exactly like they do against a <textarea>:
 * read an abstract {value, selectionStart, selectionEnd}, apply a FormatResult.
 */
export interface VimEditorHandle {
    getState: () => TextareaState;
    applyResult: (result: FormatResult) => void;
    focus: () => void;
}

export interface VimEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
    disabled?: boolean;
    className?: string;
    /** Called when an image file is pasted or dropped (parent handles upload). */
    onImageFile?: (file: File) => void;
}

/** Inherits app colours/fonts so it blends into the existing shadcn editor. */
const theme = EditorView.theme({
    '&': {
        backgroundColor: 'transparent',
        color: 'inherit',
        fontSize: '0.875rem',
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': {
        fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
        lineHeight: '1.6',
    },
    '.cm-content': { padding: '0.5rem 0.75rem' },
    '.cm-gutters': {
        backgroundColor: 'transparent',
        color: 'var(--muted-foreground, #888)',
        border: 'none',
    },
    '.cm-activeLine': { backgroundColor: 'transparent' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'currentColor' },
    // Vim normal-mode block cursor.
    '.cm-fat-cursor': {
        background: 'var(--primary, #888)',
        color: 'var(--primary-foreground, #fff)',
    },
    '&:not(.cm-focused) .cm-fat-cursor': {
        background: 'none',
        outline: 'solid 1px var(--primary, #888)',
    },
});

const VimEditor = React.forwardRef<VimEditorHandle, VimEditorProps>(
    function VimEditor(
        { value, onChange, placeholder, minHeight, disabled, className, onImageFile },
        ref
    ) {
        const hostRef = React.useRef<HTMLDivElement>(null);
        const viewRef = React.useRef<EditorView | null>(null);
        const editableRef = React.useRef(new Compartment());

        // Keep latest callbacks without recreating the editor.
        const onChangeRef = React.useRef(onChange);
        onChangeRef.current = onChange;
        const onImageFileRef = React.useRef(onImageFile);
        onImageFileRef.current = onImageFile;

        React.useImperativeHandle(ref, () => ({
            getState: () => {
                const view = viewRef.current;
                if (!view) {
                    return { value, selectionStart: 0, selectionEnd: 0 };
                }
                const sel = view.state.selection.main;
                return {
                    value: view.state.doc.toString(),
                    selectionStart: sel.from,
                    selectionEnd: sel.to,
                };
            },
            applyResult: (result: FormatResult) => {
                const view = viewRef.current;
                if (!view) return;
                view.dispatch({
                    changes: { from: 0, to: view.state.doc.length, insert: result.newValue },
                    selection: { anchor: result.cursorStart, head: result.cursorEnd },
                    scrollIntoView: true,
                });
                view.focus();
            },
            focus: () => viewRef.current?.focus(),
        }));

        // Create the EditorView once.
        React.useEffect(() => {
            if (!hostRef.current) return;

            const extensions = [
                vim(), // MUST come first so it wins key handling.
                lineNumbers(),
                history(),
                drawSelection(),
                indentOnInput(),
                EditorState.allowMultipleSelections.of(true),
                markdown({ base: markdownLanguage, codeLanguages: languages }),
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                EditorView.lineWrapping,
                cmPlaceholder(placeholder ?? ''),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                editableRef.current.of(EditorView.editable.of(!disabled)),
                theme,
                EditorView.updateListener.of((u) => {
                    if (u.docChanged) {
                        onChangeRef.current(u.state.doc.toString());
                    }
                }),
                EditorView.domEventHandlers({
                    paste(event) {
                        const handler = onImageFileRef.current;
                        if (!handler) return false;
                        const items = event.clipboardData?.items;
                        if (!items) return false;
                        for (const item of items) {
                            if (item.type.startsWith('image/')) {
                                const file = item.getAsFile();
                                if (file) {
                                    event.preventDefault();
                                    handler(file);
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    drop(event) {
                        const handler = onImageFileRef.current;
                        if (!handler) return false;
                        const file = event.dataTransfer?.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                            event.preventDefault();
                            handler(file);
                            return true;
                        }
                        return false;
                    },
                }),
            ];

            const view = new EditorView({
                state: EditorState.create({ doc: value, extensions }),
                parent: hostRef.current,
            });
            viewRef.current = view;

            return () => {
                view.destroy();
                viewRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // Reflect external value changes (controlled component).
        React.useEffect(() => {
            const view = viewRef.current;
            if (!view) return;
            const current = view.state.doc.toString();
            if (value !== current) {
                view.dispatch({
                    changes: { from: 0, to: current.length, insert: value },
                });
            }
        }, [value]);

        // Reflect disabled changes without rebuilding the editor.
        React.useEffect(() => {
            const view = viewRef.current;
            if (!view) return;
            view.dispatch({
                effects: editableRef.current.reconfigure(
                    EditorView.editable.of(!disabled)
                ),
            });
        }, [disabled]);

        return (
            <div
                ref={hostRef}
                className={className}
                style={{ minHeight, width: '100%', overflow: 'auto' }}
            />
        );
    }
);

export default VimEditor;
