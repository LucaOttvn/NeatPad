import Dexie, { type EntityTable } from 'dexie';
import { Note } from './interfaces';


const db = new Dexie('NotesDatabase') as Dexie & {
  notes: EntityTable<
    Note,
    'id' // primary key
  >;
};

db.version(1).stores({
  notes: '++id, user, pinned, last_update, *folders, *collaborators'
});

export { db };