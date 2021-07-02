/**
 * TODO: añadir code, img y title
 * TODO: Guía de estructura de por defectos
 * TODO: Interface de tags
 */
import { AnyJson } from '@salesforce/ts-types';
import json2md = require('json2md');
import { customObject } from '../../lib/parser/defaults/CustomObjectsMd';

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

export const jsonToMarkdown = async (
  parsedmtd: AnyJson,
  metadataname: string
): Promise<string> => {
  const toMd = [];
  let md;
  for (const mdTag of customObject) {
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
            /*md[element] = typeof mdTag[element] === 'object'
              ? (mdTag[element].label || '') + (mdTag[element].separator || (mdTag[element].label ? DEFAULT_SEPARATOR_LABEL : '')) + parsedmtd[mdTag[element].type]
              : mdTag[element];*/
            md[element] = getMdElementContent(mdTag[element], parsedmtd);
            break;
          }
          case 'p':
          case 'blockquote': {
            md[element] = getMdElementContent(mdTag[element], parsedmtd);
            /*if (Array.isArray(mdTag[element]) && mdTag[element].length > 0) {
              md[element] = [];
              for (const item of mdTag[element] as []) {
                md[element].push(
                  typeof item === 'object'
                    ? (item.label || '') + (item.separator || (item.label ? DEFAULT_SEPARATOR_LABEL : '')) + parsedmtd[item.type]
                    : mdTag[element]
                );
              }
            } else {
              md[element] = getMdElementContent(mdTag[element], parsedmtd);
            }*/
            break;
          }
          case 'img': {
            if (
              typeof mdTag[element] === 'object' &&
              mdTag[element].type != null &&
              parsedmtd[mdTag[element].type] != null
            ) {
              md[element] = {
                source: parsedmtd[mdTag[element].type],
                title: mdTag[element].label,
                alt: mdTag[element].alt
              };
            } else {
              if (mdTag[element].source != null) {
                md[element] = {
                  source: mdTag[element].source,
                  title: mdTag[element].label,
                  alt: mdTag[element].alt
                };
              }
            }
            break;
          }
          case 'ul':
          case 'ol': {
            md[element] = [];
            for (const li of mdTag[element]) {
              if (typeof li === 'object') {
                if (li.elements != null) {
                  if (parsedmtd[li.type]) {
                    const values = [];
                    if (Array.isArray(parsedmtd[li.type])) {
                      for (const li2 of parsedmtd[li.type]) {
                        const v = [];
                        for (const e of li.elements) {
                          v.push(li2[e]);
                        }
                        values.push(
                          v.join(li.separator || DEFAULT_SEPARATOR_LIST)
                        );
                      }
                    } else {
                      for (const e of li.elements) {
                        values.push(parsedmtd[li.type][e]);
                      }
                    }
                    md[element].push(values);
                  }
                } else {
                  md[element].push(
                    (li.label || '') +
                      (li.separator ||
                        (li.label ? DEFAULT_SEPARATOR_LABEL : '')) +
                      parsedmtd[li.type]
                  );
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
            if (
              typeof mdTag[element] === 'object' &&
              mdTag[element].type != null &&
              parsedmtd[mdTag[element].type] != null
            ) {
              md[element] = {
                content: parsedmtd[mdTag[element].type],
                language: mdTag[element].language
              };
            } else {
              if (
                mdTag[element].content != null &&
                mdTag[element].language != null
              ) {
                md[element] = {
                  content: mdTag[element].content,
                  language: mdTag[element].language
                };
              }
            }
            break;
          }
          case 'table': {
            if (
              typeof mdTag[element] === 'object' &&
              mdTag[element].type &&
              parsedmtd[mdTag[element].type]
            ) {
              md[element] = { headers: mdTag[element].headers, rows: [] };
              for (const li of parsedmtd[mdTag[element].type]) {
                const columns = [];
                for (const attr of mdTag[element].rows) {
                  columns.push(li[attr] != null ? String(li[attr]) : ' ');
                }
                md[element].rows.push(columns);
              }
            } else {
              md = null;
            }
            break;
          }
          case 'link': {
            if (
              typeof mdTag[element] === 'object' &&
              mdTag[element].type != null &&
              parsedmtd[mdTag[element].type] != null &&
              mdTag[element].label != null
            ) {
              md[element] = {
                title: mdTag[element].label,
                source: parsedmtd[mdTag[element].type]
              };
            }
            break;
          }
        }
        if (md != null && Object.keys(md).length > 0) toMd.push(md);
      }
    }
  }
  return json2md(toMd);
  /**
   * [
   * { h1: "heading 1" },
   * { h2: "heading 2" },
   * { h3: "heading 3" },
   * { h4: "heading 4" },
   * { h5: "heading 5" },
   * { h6: "heading 6" },
   * { p: "Hello World"} or multiple paragraphs: { p: ["Hello", "World"] },
   * { blockquote: "Hello World"} or multiple blockquotes: { blockquote: ["Hello", "World"] },
   * { img: { title: "My image title", source: "http://example.com/image.png", alt: "My image alt" } },
   * { ul: ["item 1", "item 2"] },
   * { ol: ["item 1", "item 2"] },
   * { hr: "" },
   * { code: { "language": "html", "content": "<script src='dummy.js'></script>" } },
   * { table: { headers: ["a", "b"], rows: [{ a: "col1", b: "col2" }] } } or { table: { headers: ["a", "b"], rows: [["col1", "col2"]] } },
   * { title: 'hello', source: 'https://ionicabizau.net' }
   * ]
   */

  /*json2md.converters.sayHello = function (input, json2md) {
    return "Hello " + input + "!";
  }*/
};

function getMdElementContent(tag: any, parse: any): number {
  return typeof tag === 'object'
    ? (tag.label || '') +
        (tag.separator || (tag.label ? DEFAULT_SEPARATOR_LABEL : '')) +
        parse[tag.type]
    : tag;
}
