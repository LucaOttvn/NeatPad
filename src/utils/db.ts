import Dexie, { type EntityTable } from 'dexie';
import { Note } from './interfaces';

// tables creation (the string e.g. "id" is the primary key)
const db = new Dexie('NotesDatabase') as Dexie & {
    notes: EntityTable<Note, 'id'>;
};

db.version(1).stores({
    notes: '++id, user, pinned, last_update, *folders, *collaborators',
});

export { db };