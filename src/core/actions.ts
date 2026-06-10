import type { ToolbarActionConfig, ToolbarItem } from './types';

export const defaultToolbar: ToolbarItem[] = [
    'bold',
    'italic',
    'h2',
    'h3',
    'link',
    'code',
    'codeblock',
    'ul',
    'ol',
    'checklist',
    'quote',
    'table',
    'image',
    'hr',
    'preview',
    'vim',
];

export const toolbarActions: Record<string, ToolbarActionConfig> = {
    bold: { label: 'Bold (⌘B)', prefix: '**', suffix: '**', shortcut: 'b' },
    italic: { label: 'Italic (⌘I)', prefix: '_', suffix: '_', shortcut: 'i' },
    h1: { label: 'Heading 1', prefix: '# ', suffix: '', block: true },
    h2: { label: 'Heading 2', prefix: '## ', suffix: '', block: true },
    h3: { label: 'Heading 3', prefix: '### ', suffix: '', block: true },
    link: { label: 'Link (⌘K)', prefix: '[', suffix: '](url)', shortcut: 'k' },
    code: { label: 'Inline Code', prefix: '`', suffix: '`' },
    codeblock: { label: 'Code Block', prefix: '```\n', suffix: '\n```', block: true },
    ul: { label: 'Bullet List', prefix: '- ', suffix: '', block: true },
    ol: { label: 'Numbered List', prefix: '1. ', suffix: '', block: true },
    checklist: { label: 'Checklist', prefix: '- [ ] ', suffix: '', block: true },
    quote: { label: 'Quote', prefix: '> ', suffix: '', block: true },
    hr: { label: 'Horizontal Rule', prefix: '\n---\n', suffix: '', block: true },
    table: { label: 'Table', prefix: '', suffix: '', handler: 'table' },
    image: { label: 'Image', prefix: '![', suffix: '](url)', handler: 'image' },
};

export const tableTemplate = `| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`;
