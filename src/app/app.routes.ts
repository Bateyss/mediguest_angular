import { Routes } from '@angular/router';
import { CitaManagementComponent } from './components/cita-management-component/cita-management-component';
import { HorariosMedicosComponent } from './components/horarios-medicos-component/horarios-medicos-component';
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
            { path: 'horarios', component: HorariosMedicosComponent },
            { path: 'citas', component: CitaManagementComponent },
        ]
    }
];
