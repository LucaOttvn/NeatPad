import { createNote } from "@/serverActions/notesActions"
import { Note } from "@/utils/interfaces"

// IF THE INITIAL FETCH WASNT SUCCESSFUL PREVENT ANY SORT OF SYNC

enum EntitiesEnum {
    notes = 'notes',
    folders = 'folders'
}

enum OperationsEnum {
    add = 'add',
    update = 'update',
    delete = 'delete',
}

interface SyncQueueItem {
    id: number
    note: Note
    entityType: EntitiesEnum
    operation: OperationsEnum
    time: Date
}

const syncQueue: SyncQueueItem[] = db.syncQueue.toArray()

// for each entity
Object.keys(EntitiesEnum).forEach(async entity => {

    syncQueue.filter(item => item.time)

    const localDb = db[entity].toArray()
    // get the items to sync filtered by entity type
    const entitySyncItems = syncQueue.filter(item => item.entityType == entity)
    let itemsToAdd: number[] = []
    let itemsToUpdate: number[] = []
    let itemsToDelete: number[] = []

    // split the data in toAdd/toUpdate/toDelete
    entitySyncItems.forEach(syncItem => {
        switch (syncItem.operation) {
            case OperationsEnum.add:
                itemsToAdd.push(syncItem.id)
                break;
            case OperationsEnum.update:
                itemsToUpdate.push(syncItem.id)
                break;
            case OperationsEnum.delete:
                itemsToDelete.push(syncItem.id)
                break;

            default:
                break;
        }
    })

    // return the data for each item to add and push it into the new array
    const dataToAdd: number[] = itemsToAdd.map(id => localDb.find((item: any) => item.id === id));
    const dataToUpdate: number[] = itemsToUpdate.map(id => localDb.find((item: any) => item.id === id));
    const dataToDelete: number[] = itemsToDelete.map(id => localDb.find((item: any) => item.id === id));
});



// THREE-WAY MERGE APPROACH
/**
 * 1) Store the base version
 * - On each update keep track of the base version of the note, this is the local basic version before any local update.  
 * - Before triggering the first update on any note the base version gets saved  
 * 
 * 2) Store the three versions
 * the result for each note has to be: 
 * interface noteToSync = {
 *      baseVersion: Note
 *      lastVersion: Note
 *      remoteVersion: Note
 * }
 * 
 * - the baseVersion is the result of the previous point
 * - the lastVersion is the current latest local updated version
 * - the remoteVersion is the current remote version in the db
 * 
 * 3) for each base version => merge:
 * get the base version
 * get the remote version
 * get the latest local version   
 * compare them
 */

for (const data of dataToAdd) {
    try {
        if (entity === EntitiesEnum.notes) await createNote(data)
        if (entity === EntitiesEnum.folders) await createFolder(data)

        db.syncQueue.removeItem(data)

    } catch (error) {
        console.log(error)
    }

}

for (const data of dataToUpdate) {
    try {
        if (entity === EntitiesEnum.notes) await updateNote(data)
        if (entity === EntitiesEnum.folders) await updateFolder(data)

        db.syncQueue.removeItem(data)

    } catch (error) {
        console.log(error)
    }

}

for (const data of dataToDelete) {
    try {
        if (entity === EntitiesEnum.notes) await deleteNote(data)
        if (entity === EntitiesEnum.folders) await deleteFolder(data)

        db.syncQueue.removeItem(data)

    } catch (error) {
        console.log(error)
    }

}


/**
 * on each note update
 * 1) put the basic version of the note in the notesBaseVersions table
 * 2) update the note
 * 
 * on note delete
 * 1) delete the note
 * 2) look for the note in the notesBaseVersions table and remove it if found
 */


/**
 * 
 */

