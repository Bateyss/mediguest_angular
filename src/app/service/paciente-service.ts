import { inject, Injectable } from '@angular/core';
import { AbstractService } from './core/abstract-service';
import { Paciente } from '../models/paciente';
import { LocalStorageService } from './core/local-storage-service';
import { DataApp } from '../util/data-app';

@Injectable({
  providedIn: 'root',
})
export class PacienteService extends AbstractService<Paciente> {
  constructor() {
    super(inject(LocalStorageService), DataApp.PACIENTE_ID);
  }

  override getRandomData(): Paciente[] {
    return DataApp.getPacienteListRandom();
  }
}
