import { inject, Injectable } from '@angular/core';
import { ConsultaMedica } from '../models/consulta-medica';
import { DataApp } from '../util/data-app';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class ConsultaMedicaService extends AbstractService<ConsultaMedica> {
  constructor() {
    super(inject(LocalStorageService), DataApp.CONSULTA_ID);
  }

  override getRandomData(): ConsultaMedica[] {
    return DataApp.getConsultaListRandom();
  }
}
