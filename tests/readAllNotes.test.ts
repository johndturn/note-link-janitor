import { expect, test } from 'vitest';

import readAllNotes from '../lib/readAllNotes.js';

test('correctly reads notes from 1 path', async () => {
  const folderPath = './tests/test-data-1/';
  const notes = await readAllNotes([folderPath]);

  // NOTE: We assume that there are 5 notes in the test-data folder
  expect(Object.keys(notes).length).toBe(5);

  for (const notePath in notes) {
    const note = notes[notePath];
    expect(note.title).toBeDefined();
    expect(note.links).toBeDefined();
    expect(note.noteContents).toBeDefined();
    expect(note.parseTree).toBeDefined();
  }
});

test('correctly reads notes from 2 paths', async () => {
  const folderPaths = ['./tests/test-data-1/', './tests/test-data-2/'];
  const notes = await readAllNotes(folderPaths);

  // NOTE: We assume that there are 3 notes in the test-data-2 folder
  expect(Object.keys(notes).length).toBe(8);

  for (const notePath in notes) {
    const note = notes[notePath];
    expect(note.title).toBeDefined();
    expect(note.links).toBeDefined();
    expect(note.noteContents).toBeDefined();
    expect(note.parseTree).toBeDefined();
  }
});
