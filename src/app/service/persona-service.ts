import { inject, Injectable } from "@angular/core";
import { Persona } from "../models/persona";
import { AbstractService } from "./core/abstract-service";
import { LocalStorageService } from "./core/local-storage-service";
import { DataApp } from "../util/data-app";


@Injectable({
  providedIn: 'root',
})
export class PersonaService extends AbstractService<Persona> {

  constructor() {
    super(inject(LocalStorageService), DataApp.PERSONA_ID);
  }

  override getRandomData(): Persona[] {
    return DataApp.getPersonaListRandom();
  }
}
