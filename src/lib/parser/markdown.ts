/**
 * TODO: define here functionality
 */
import { AnyJson } from '@salesforce/ts-types';
import { CustomObject } from '../../lib/parser/defaults/CustomObjectsMd';
// import { json2md } from 'json2md';
const json2md = require('json2md');

enum SUPPORTED_ELEMENTS {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  img,
  ul,
  ol,
  hr,
  code,
  table,
  title
}

const DEFAULT_SEPARATOR_LABEL = ': ';
const DEFAULT_SEPARATOR_LIST = ' | ';

json2md.converters.sayHello = function (input, json2md) {
  return "Hello " + input + "!";
}

export const jsonToMarkdown = async (parsedmtd: AnyJson): Promise<string> => {
  const toMd = [];
  let md;
  for (const mdTag of CustomObject) {
    for (const element in mdTag) {
      if ((element as string) in SUPPORTED_ELEMENTS) {
        md = {};
        switch (element) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6': {
            md[element] = typeof mdTag[element] == 'object'
              ? (mdTag[element].label || '') + (mdTag[element].separator || (mdTag[element].label ? DEFAULT_SEPARATOR_LABEL : '')) + parsedmtd[mdTag[element].type]
              : mdTag[element];
            console.log(md[element]);
            break;
          }
          case 'p': {
            //statements; 
            break;
          }
          case 'blockquote': {
            //statements; 
            break;
          }
          case 'img': {
            //statements; 
            break;
          }
          case 'ul':
          case 'ol': {
            md[element] = [];
            for (const li of mdTag[element]) {
              if (typeof li == 'object') {
                if (li.elements != null) {
                  if (parsedmtd[li.type]) {
                    let values = [];
                    if (Array.isArray(parsedmtd[li.type])) {
                      for (let li2 of parsedmtd[li.type]) {
                        let v = [];
                        for (let e of li.elements) {
                          v.push(li2[e]);
                        }
                        values.push(v.join(li.separator || DEFAULT_SEPARATOR_LIST));
                      }
                    } else {
                      for (let e of li.elements) {
                        values.push(parsedmtd[li.type][e]);
                      }
                    }
                    md[element].push(values);
                  }
                } else {
                  md[element].push((li.label || '') + (li.separator || (li.label ? DEFAULT_SEPARATOR_LABEL : '')) + parsedmtd[li.type]);
                }
              } else {
                md[element].push(li);
              }
            }
            if (Array.isArray(md[element]) && !md[element].length) {
              md = null;
            }
            break;
          }
          case 'hr': {
            md[element] = '';
            break;
          }
          case 'code': {
            //statements; 
            break;
          }
          case 'table': {
            if (typeof mdTag[element] == 'object' && mdTag[element].type && parsedmtd[mdTag[element].type]) {
              md[element] = { headers: mdTag[element].headers, rows: [] };
              for (let li of parsedmtd[mdTag[element].type]) {
                let columns = [];
                for (let attr of mdTag[element].rows) {
                  columns.push(li[attr] != null ? String(li[attr]) : ' ');
                }
                console.log(columns);
                md[element].rows.push(columns);
              }
            } else {
              md = null;
            }
            break;
          }
          case 'title': {
            //statements; 
            break;
          }
        }
        if (md != null) toMd.push(md);
      }
    }
  }
  console.log(toMd);
  return json2md(toMd);
  /**
   * [
    { h1: "heading 1" },
    { h2: "heading 2" },
    { h3: "heading 3" },
    { h4: "heading 4" },
    { h5: "heading 5" },
    { h6: "heading 6" },
    { p: "Hello World"} or multiple paragraphs: { p: ["Hello", "World"] },
    { blockquote: "Hello World"} or multiple blockquotes: { blockquote: ["Hello", "World"] },
    { img: { title: "My image title", source: "http://example.com/image.png", alt: "My image alt" } },
    { ul: ["item 1", "item 2"] },
    { ol: ["item 1", "item 2"] },
    { hr: "" },
    { code: { "language": "html", "content": "<script src='dummy.js'></script>" } },
    { table: { headers: ["a", "b"], rows: [{ a: "col1", b: "col2" }] } } or { table: { headers: ["a", "b"], rows: [["col1", "col2"]] } },
    { title: 'hello', source: 'https://ionicabizau.net' }
]
   */
  /*return json2md([
    { h1: 'JSON To Markdown' },
    { blockquote: 'A JSON to Markdown converter.' },
    {
      img: [
        { title: 'Some image', source: 'https://example.com/some-image.png' },
        {
          title: 'Another image',
          source: 'https://example.com/some-image1.png'
        },
        {
          title: 'Yet another image',
          source: 'https://example.com/some-image2.png'
        }
      ]
    },
    { h2: 'Features' },
    {
      ul: [
        'Easy to use',
        'You can programmatically generate Markdown content',
        '...'
      ]
    },
    { h2: 'How to contribute' },
    {
      ol: ['Fork the project', 'Create your branch', 'Raise a pull request']
    },
    { h2: 'Code blocks' },
    { p: 'Below you can see a code block example.' },
    {
      code: {
        language: 'js',
        content: ['function sum (a, b) {', '   return a + b', '}', 'sum(1, 2)']
      }
    }
  ]);*/
};
