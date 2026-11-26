import { Routes } from '@angular/router';
import { AgendaCitasComponent } from './components/agenda-citas-component/agenda-citas-component';
import { CitaManagementComponent } from './components/cita-management-component/cita-management-component';
import { ConsultaMedicaManagementComponent } from './components/consulta-medica-management-component/consulta-medica-management-component';
import { ExpedienteFormComponent } from './components/expediente-form-component/expediente-form-component';
import { HorariosMedicosComponent } from './components/horarios-medicos-component/horarios-medicos-component';
import { Inicio } from './components/inicio/inicio';
import { Login } from './components/login/login';
import { Pacientes } from './components/pacientes/pacientes';
import { RecetaMedicaManagementComponent } from './components/receta-medica-management-component/receta-medica-management-component';

export const routes: Routes = [
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    {
        path: 'menu', component: Inicio, children: [
            { path: '', redirectTo: '/menu/login', pathMatch: 'full' },
            { path: 'login', component: Login, },
            { path: 'pacientes', component: Pacientes, },
            { path: 'horarios', component: HorariosMedicosComponent },
            { path: 'citas', component: CitaManagementComponent },
            { path: 'agenda', component: AgendaCitasComponent },
            { path: 'expediente', component: ExpedienteFormComponent },
            { path: 'consulta', component: ConsultaMedicaManagementComponent },
            { path: 'receta', component: RecetaMedicaManagementComponent },
        ]
    }
];
