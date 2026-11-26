import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NavigationExtras, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialToolbarModule } from '../../material/material-module';
import { Menu } from '../../models/util/menu';
import { LocalStorageService } from '../../service/core/local-storage-service';
import { ThemeService } from '../../service/util/theme-service';
import { DataApp } from '../../util/data-app';
import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [NgOptimizedImage, MaterialToolbarModule, RouterOutlet, MatDividerModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        // Example: turns "avatar" + width 400 into "avatar_400.png"
        return `${config.src}`;
      },
    },
  ]
})
export class Inicio implements OnInit {

  logged = signal<boolean>(false);
  isChecked = signal<boolean>(false);
  public isLightTheme = signal<boolean>(true);

  private localStorage = inject(LocalStorageService);
  private themeService = inject(ThemeService);

  private _router = inject(Router);

  public menusList = signal<Array<Menu>>([]);

  ngOnInit(): void {
    this.cargarMenusDeMantenimientos();
    this.validarUsuarioLogeado();
    var themex = this.themeService.getTheme();
    this.isLightTheme.update(val => themex == 'light');
  }

  cargarMenusDeMantenimientos() {
    var nuevosMenus: Array<Menu> = [];
    nuevosMenus.push({ id: 1, ruta: '/menu/login', nombre: 'Iniciar Sesion' });
    nuevosMenus.push({ id: 2, ruta: '/menu/pacientes', nombre: 'Pacientes' });
    nuevosMenus.push({ id: 3, ruta: '/menu/horarios', nombre: 'Horarios' });
    nuevosMenus.push({ id: 4, ruta: '/menu/citas', nombre: 'Citas' });
    nuevosMenus.push({ id: 5, ruta: '/menu/agenda', nombre: 'Agenda' });
    nuevosMenus.push({ id: 6, ruta: '/menu/expediente', nombre: 'Expedientes' });
    nuevosMenus.push({ id: 7, ruta: '/menu/consulta', nombre: 'Consultas' });
    nuevosMenus.push({ id: 8, ruta: '/menu/receta', nombre: 'Recetas' });
    this.menusList.update(valores => [...nuevosMenus]);
  }

  onThemeSwitchChange() {
    this.themeService.toggleTheme();
  }

  routerActivated(value: any): void {
    this.validarUsuarioLogeado();
  }

  homeClick() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "nada": 'xd'
      }
    };
    this._router.navigate(['/menu/productos'], navigationExtras);
  }

  cerrarSesion() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "logged": 'false'
      }
    };
    this.localStorage.setItem(DataApp.LOGGED, 'false');
    this._router.navigate(['/menu/login'], navigationExtras);
  }

  limpiarDatos() {
    this.localStorage.clear();
  }

  validarUsuarioLogeado() {
    const logged1 = this.localStorage.getItem(DataApp.LOGGED);
    this.logged.update(val => (logged1 == true));
  }

}
