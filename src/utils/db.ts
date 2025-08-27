import Dexie, { type EntityTable } from 'dexie';
import { Folder, Note, Tombstone } from './interfaces';

// tables creation (the string e.g. "id" is the primary key)
const db = new Dexie('NotesDatabase') as Dexie & {
    notes: EntityTable<Note, 'id'>;
    notesTombstones: EntityTable<Tombstone, 'id'>;
    folders: EntityTable<Folder, 'id'>;
    foldersTombstones: EntityTable<Tombstone, 'id'>;
};

db.version(1).stores({
    notes: '++id, user, pinned, last_update, *folders, *collaborators',
    notesTombstones: 'id',
    folders: '++id, user, name, color',
    foldersTombstones: 'id',
});

export { db };