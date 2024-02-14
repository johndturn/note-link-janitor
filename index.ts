#!/usr/bin/env node

import fs from 'fs';
import graph from 'pagerank.js';

import readAllNotes from './lib/readAllNotes.js';
import createLinkMap from './lib/createLinkMap.js';
import updateBacklinks from './lib/updateBacklinks.js';

await main();

async function main() {
  const paths = process.argv.slice(2);
  if (!paths || paths.length === 0 || paths[0] === '--help') {
    printUsage();
    return;
  }

  const notes = await readAllNotes(paths);

  // NOTE: We need this later to look up the valid title of a given note
  const notesByFilename = Object.values(notes).reduce((acc, note) => {
    acc[note.fileNameNoExt] = note;
    return acc;
  });

  const linkMap = createLinkMap(Object.values(notes));

  // Sort by PageRank
  for (const note of linkMap.keys()) {
    const entry = linkMap.get(note)!;
    for (const linkingNote of entry.keys()) {
      graph.link(linkingNote, note, 1.0);
    }
  }

  const noteRankings: { [key: string]: number } = {};
  graph.rank(0.85, 0.000001, function (node, rank) {
    noteRankings[node] = rank;
  });

  await Promise.all(
    Object.keys(notes).map(async notePath => {
      const note = notes[notePath];
      const backlinks = linkMap.get(note.fileNameNoExt);

      const backlinkEntries = backlinks
        ? [...backlinks.keys()]
            .map(sourceNoteName => {
              const sourceNoteTitle = notesByFilename[sourceNoteName].title;
              return {
                sourceNoteName,
                sourceNoteTitle,
                context: backlinks.get(sourceNoteName)!,
              };
            })
            .sort(
              ({ sourceNoteName: sourceTitleA }, { sourceNoteName: sourceTitleB }) =>
                (noteRankings[sourceTitleB] || 0) - (noteRankings[sourceTitleA] || 0),
            )
        : [];

      const newContents = updateBacklinks(notes[notePath].parseTree, notes[notePath].noteContents, backlinkEntries);

      if (newContents !== notes[notePath].noteContents) {
        await fs.promises.writeFile(note.notePath, newContents, {
          encoding: 'utf-8',
        });
      }
    }),
  );
}

function printUsage() {
  console.log('');
  console.log('Usage: note-link-janitor [NOTE_DIRECTORY]');
  console.log(
    '\t- NOTE_DIRECTORY: One or more directories to read .md files from. If multiple are included, please separate them with a space',
  );
  console.log('Ex: note-link-janitor ~/notes');
  console.log('Ex: note-link-janitor ~/my-project/notes ~/my-project/content ~/my-project/blog');
  console.log('');
}
