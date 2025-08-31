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
    entityType: EntitiesEnum
    operation: OperationsEnum
    time: Date
}

const syncQueueItems: any[] = []

// for each entity
Object.keys(EntitiesEnum).forEach(async entity => {
    const localDb = db[entity].toArray()
    // filter by entity type
    const entitySyncItems = syncQueueItems.filter(item => item.entityType == entity)
    let itemsToAdd: any[] = []
    let itemsToUpdate: any[] = []
    let itemsToDelete: any[] = []

    // split the data in toAdd/toUpdate/toDelete
    entitySyncItems.forEach(syncItem => {
        switch (syncItem.operation) {
            case OperationsEnum.add:
                itemsToAdd.push(syncItem.id)
                break;
            case OperationsEnum.update:
                itemsToUpdate.push(syncItem.id)
                break;
            case OperationsEnum.add:
                itemsToDelete.push(syncItem.id)
                break;

            default:
                break;
        }
    })

    const dataToAdd = itemsToAdd
        // return just the elements that are found in the local db (filter null values)
        .filter(id => localDb.some((item: any) => item.id === id))
        // return the data for each item to add and push it into the new array
        .map(id => localDb.find((item: any) => item.id === id));

    const dataToUpdate = itemsToUpdate
        .filter(id => localDb.some((item: any) => item.id === id))
        .map(id => localDb.find((item: any) => item.id === id));

    const dataToDelete = itemsToDelete
        .filter(id => localDb.some((item: any) => item.id === id))
        .map(id => localDb.find((item: any) => item.id === id));

    // update the db
    await Promise.all([
        addNotes(dataToAdd),
        updateNotes(dataToUpdate),
        deleteNotes(dataToDelete)
    ]);
});