import { inject, Injectable } from '@angular/core';
import { Expediente } from '../models/expediente';
import { DataApp } from '../util/data-app';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService extends AbstractService<Expediente> {
  constructor() {
    super(inject(LocalStorageService), DataApp.EPEDIENTE_ID);
  }

  override getRandomData(): Expediente[] {
    return DataApp.getExpedienteListRandom();
  }
}
