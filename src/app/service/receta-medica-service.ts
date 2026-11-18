import { inject, Injectable } from '@angular/core';
import { RecetaMedica } from '../models/receta-medica';
import { DataApp } from '../util/data-app';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class RecetaMedicaService extends AbstractService<RecetaMedica> {
  constructor() {
    super(inject(LocalStorageService), DataApp.RECETA_ID);
  }

  override getRandomData(): RecetaMedica[] {
    return DataApp.getRecetaListRandom();
  }
}
