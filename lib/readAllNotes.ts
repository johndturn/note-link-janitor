import fs from 'fs';
import type { Root, Heading } from 'mdast';
import * as path from 'path';

import getNoteLinks, { NoteLinkEntry } from './getNoteLinks.js';
import { getProcessor, getHeadingFinder } from './processor.js';

interface Note {
  title: string;
  notePath: string;
  links: NoteLinkEntry[];
  noteContents: string;
  parseTree: Root;
}

export default async function readAllNotes(noteFolderPaths: string[]): Promise<{ [key: string]: Note }> {
  const notesForPath: { [key: string]: Note } = {};

  for (const noteFolderPath of noteFolderPaths) {
    const noteDirectoryEntries = await fs.promises.readdir(noteFolderPath, {
      withFileTypes: true,
    });

    const notePaths = noteDirectoryEntries
      .filter(entry => entry.isFile() && !entry.name.startsWith('.') && entry.name.endsWith('.md'))
      .map(entry => path.join(noteFolderPath, entry.name));

    for (const notePath of notePaths) {
      const note = await readNote(notePath);
      notesForPath[notePath] = note;
    }
  }

  return notesForPath;
}

async function readNote(notePath: string): Promise<Note> {
  const noteContents = await fs.promises.readFile(notePath, {
    encoding: 'utf-8',
  });

  const processor = getProcessor();
  const parseTree = processor.parse(noteContents);

  const headingNode = await getHeadingFinder().run(parseTree);
  if (headingNode.type === 'missingTitle') {
    throw new Error(`${notePath} has no title`);
  }

  const title = processor()
    .stringify({ type: 'root', children: (headingNode as Heading).children })
    .trimEnd();

  const links = getNoteLinks(parseTree);

  return { title, notePath, links, parseTree, noteContents };
}
