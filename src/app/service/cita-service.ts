import { inject, Injectable } from '@angular/core';
import { Cita } from '../models/cita';
import { DataApp } from '../util/data-app';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class CitaService extends AbstractService<Cita> {
  constructor() {
    super(inject(LocalStorageService), DataApp.CITA_ID);
  }

  override getRandomData(): Cita[] {
    return DataApp.getCitaListRandom();
  }
}
