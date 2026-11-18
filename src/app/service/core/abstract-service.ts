import { LocalStorageService } from "./local-storage-service";


export interface EntityModel {
    id: number;
}

export abstract class AbstractService<Entity extends EntityModel> {

    private list: Array<Entity> = [];

    constructor(
        public localStorageService: LocalStorageService,
        public storageID: string
    ) {
    }

    abstract getRandomData(): Array<Entity>;

    getEntityList(): Array<Entity> {
        var responseList: Array<Entity> = [];

        var responseListSession = this.localStorageService.getItem<Array<Entity>>(this.storageID);
        if (responseListSession) {
            responseList = responseListSession;
        }

        if (!responseList || responseList.length == 0) {
            responseList = this.getRandomData();
            this.localStorageService.setItem(this.storageID, responseList);
        }

        return responseList;
    }
    pushEntity(datos: Entity) {
        var entityList: Array<Entity> = this.getEntityList();
        datos.id = entityList[entityList.length - 1].id + 1;
        entityList.push(datos);
        this.localStorageService.setItem(this.storageID, entityList);
    }
}


