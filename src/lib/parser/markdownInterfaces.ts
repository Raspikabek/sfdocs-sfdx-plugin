export interface MarkdownTag {
    h1?: string | MarkdownObject;
    h2?: string | MarkdownObject;
    h3?: string | MarkdownObject;
    h4?: string | MarkdownObject;
    h5?: string | MarkdownObject;
    h6?: string | MarkdownObject;
    p?: string | MarkdownObject;
    blockquote?: string | MarkdownObject;
    img?: MarkdownObject;
    ul?: MarkdownObject[];
    ol?: MarkdownObject[];
    hr?: string;
    code?: MarkdownObject;
    table?: MarkdownObject;
    link?: MarkdownObject;
    // [key: string]: string | MarkdownObject | MarkdownObject[];
}
export interface MarkdownObject {
    type?: string;
    label?: string;
    separator?: string;
    headers?: string[];
    rows?: string[];
    elements?: string[];
    content?: string;
    language?: string;
    alt?: string;
    source?: string;
}
