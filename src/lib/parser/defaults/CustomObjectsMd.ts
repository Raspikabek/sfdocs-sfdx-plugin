export const customObject = [
  { h1: { type: 'label' } },
  { h3: { type: 'pluralLabel', label: 'Plural Label', separator: ' --> ' } },
  { h3: { type: 'fullName', label: 'Full Name', separator: ' --> ' } },
  { h3: { type: 'visibility', label: 'Visibility' } },
  { hr: '' },
  { p: { type: 'pluralLabel', label: 'Plural Label', separator: ' = ' } },
  {
    p: [
      { type: 'pluralLabel', label: 'Plural Label', separator: ' =>> ' },
      { type: 'fullName', label: 'Full Name', separator: ' =>> ' }
    ]
  },
  { hr: '' },
  { blockquote: { type: 'pluralLabel', label: 'Plural Label', separator: ' = ' } },
  {
    blockquote: [
      { type: 'pluralLabel', label: 'Plural Label', separator: ' =>> ' },
      { type: 'fullName', label: 'Full Name', separator: ' =>> ' }
    ]
  },
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
  { table: { type: 'fields', headers: ['Label', 'Full Name', 'Type', 'Reference To', 'Required'], rows: ['label', 'fullName', 'type', 'referenceTo', 'required'] } }
];
// { table: { headers: ['Label', 'Full Name', 'Type'], rows: [['label', 'fullName', 'type']] } }
/*
{ table: { headers: ['a', 'b'], rows: [{ a: 'col1', b: 'col2' }] } } or { table: { headers: ['a', 'b'], rows: [['col1', 'col2']] } }
*/
/*
export const CustomObject = {
  section: [
    {
      title: 'Atributos',
      elements: {
        label: { mdTag: 'h1' },
        pluralLabel: {
          label: 'Plural Label', mdTag: 'h3'
        }
      }
    },
    {
      title: { label: { mdTag: 'h1' } },
      elements: {
        pluralLabel: {
          label: 'Plural Label', mdTag: 'h3'
        }
      }
    }
  ]
};
*/
