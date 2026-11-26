import { inject, Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { DataApp } from '../util/data-app';
import { Utils } from '../util/utils';
import { AbstractService } from './core/abstract-service';
import { LocalStorageService } from './core/local-storage-service';

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

  validarUsuario(user: string, pass: string): Usuario | null {
    var passEncrypted = '';
    Utils.generateSHA256(pass).then(b => passEncrypted = b);
    var usuarioList: Array<Usuario> = this.getEntityList();

    var usuarioSesion = DataApp.getUsuarioVacio();

    if (usuarioList && usuarioList.length) {
      usuarioList
        .filter(usuario => usuario.usuario == user)
        .filter(usuario => usuario.password == passEncrypted)
        .forEach(usuario => usuarioSesion = usuario);
    }

    if (usuarioSesion && usuarioSesion.id > 1) {
      return usuarioSesion;
    } else {
      return null;
    }
  }
}
