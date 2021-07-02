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
  //[key: string]: string | MarkdownObject | MarkdownObject[];
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
}
export const customObject = [
  { h1: { type: 'label' } },
  { h3: { type: 'pluralLabel', label: 'Plural Label', separator: ' --> ' } },
  { h3: { type: 'fullName', label: 'Full Name', separator: ' --> ' } },
  { h3: { type: 'visibility', label: 'Visibility' } },
  { hr: '' },
  { p: { type: 'pluralLabel', label: 'Plural Label', separator: ' = ' } },
  { hr: '' },
  { blockquote: { type: 'pluralLabel', label: 'Plural Label', separator: ' = ' } },
  { h2: 'Attributes' },
  {
    ul: [
      { type: 'enableFeeds', label: 'Enable Feeds' },
      { type: 'enableHistory', label: 'Enable History' },
      { type: 'enableActivities', label: 'Enable Activities' }
    ]
  },
  { h2: 'List Views' },
  { ul: [{ type: 'listViews', elements: ['label', 'fullName', 'filterScope', 'columns'], separator: ' | ' }] },
  { h2: 'Fields' },
  { table: { type: 'fields', headers: ['Label', 'Full Name', 'Type', 'Reference To', 'Required'], rows: ['label', 'fullName', 'type', 'referenceTo', 'required'] } },
  { code: { type: 'pluralLabel', language: 'html' } },
  { code: { language: 'html', content: '' } },
  { img: { type: 'pluralLabel', label: 'My image title', alt: 'My image alt' } },
  { img: { source: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.elconfidencial.com%2Falma-corazon-vida%2F2020-11-17%2Fcomo-me-converti-meme-disaster-girl-viral_2835535%2F&psig=AOvVaw1X5EgXiqc2Q1Fo5aB32Lq6&ust=1621721830094000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJCr8OTm2_ACFQAAAAAdAAAAABAD', label: 'My image title', alt: 'My image alt' } },
  { link: { type: 'pluralLabel', label: 'Plural Label' } }
];
