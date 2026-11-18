import { inject, Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';
import { DataApp } from '../util/data-app';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends AbstractService<Usuario> {
  constructor() {
    super(inject(LocalStorageService), DataApp.USUARIO_ID);
  }

  override getRandomData(): Usuario[] {
    return DataApp.getUsuarioListRandom();
  }
}
