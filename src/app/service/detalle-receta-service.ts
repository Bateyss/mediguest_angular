import { inject, Injectable } from '@angular/core';
import { DetalleReceta } from '../models/detalle-receta';
import { DataApp } from '../util/data-app';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class DetalleRecetaService extends AbstractService<DetalleReceta> {
  constructor() {
    super(inject(LocalStorageService), DataApp.DETALLE_RECETA_ID);
  }

  override getRandomData(): DetalleReceta[] {
    return DataApp.getDetalleRecetaListRandom();
  }
}
