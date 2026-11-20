import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Login } from './components/login/login';
import { Pacientes } from './components/pacientes/pacientes';

export const routes: Routes = [
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    {
        path: 'menu', component: Inicio, children: [
            { path: '', redirectTo: '/menu/login', pathMatch: 'full' },
            { path: 'login', component: Login, },
            { path: 'pacientes', component: Pacientes, },
        ]
    }
];
