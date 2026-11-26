import { inject, Injectable } from '@angular/core';
import { AbstractService } from './core/abstract-service';
import { Medico } from '../models/medico';
import { LocalStorageService } from './core/local-storage-service';
import { DataApp } from '../util/data-app';

@Injectable({
  providedIn: 'root',
})
export class MedicoService extends AbstractService<Medico> {
  constructor() {
    super(inject(LocalStorageService), DataApp.MEDICO_ID);
  }

  override getRandomData(): Medico[] {
    return DataApp.getMedicoListRandom();
  }
}
