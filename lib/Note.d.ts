import type { Root } from 'mdast';

import { NoteLinkEntry } from './getNoteLinks.js';

export interface Note {
  title: string;
  links: NoteLinkEntry[];
  parseTree: Root;
}
