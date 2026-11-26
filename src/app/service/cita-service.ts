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

  getCitasPorFecha(fecha: Date): Cita[] {
    var citas = this.getEntityList();
    const day = fecha.getDate();
    const mont = fecha.getMonth();
    const yea = fecha.getFullYear();
    return citas?.filter(dato => {
      var fecha_cita = new Date(dato.fecha_cita);
      return fecha_cita.getDate() == day &&
        fecha_cita.getMonth() == mont &&
        fecha_cita.getFullYear() == yea;
    }
    );
  }
}
