import Dexie, { type EntityTable } from 'dexie';
import { Folder, Note } from './interfaces';

// tables creation (the string e.g. "id" is the primary key)
const db = new Dexie('NotesDatabase') as Dexie & {
    notes: EntityTable<Note, 'id'>;
    folders: EntityTable<Folder, 'id'>;
};

db.version(1).stores({
    notes: '++id, user, pinned, last_update, *folders, *collaborators',
    folders: '++id, user, name, color'
});

export { db };