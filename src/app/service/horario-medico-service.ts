import { inject, Injectable } from '@angular/core';
import { HorarioMedico } from '../models/horario-medico';
import { DataApp } from '../util/data-app';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class HorarioMedicoService extends AbstractService<HorarioMedico> {
  constructor() {
    super(inject(LocalStorageService), DataApp.HORARIO_ID);
  }

  override getRandomData(): HorarioMedico[] {
    return DataApp.getHorarioListRandom();
  }
}
