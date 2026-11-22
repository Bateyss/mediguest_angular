import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialFormDialogModule, MaterialTableModelModule } from '../../material/material-module';
import { Cita } from '../../models/cita';
import { FieldConfig } from '../../models/util/field-config';
import { CitaService } from '../../service/cita-service';
import { HorarioMedicoService } from '../../service/horario-medico-service';
import { PacienteService } from '../../service/paciente-service';
import { FormService } from '../../service/util/form-service';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { SharedForm } from '../util/shared-form/shared-form';
import { DatePipe } from '@angular/common';
import { HourPipePipe } from '../../pipes/hour-pipe-pipe';

@Component({
  selector: 'app-cita-management-component',
  imports: [
    MaterialFormDialogModule, MaterialTableModelModule,
    MatProgressSpinnerModule, SharedForm, DatePipe, HourPipePipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './cita-management-component.html',
  styleUrl: './cita-management-component.css',
})
export class CitaManagementComponent implements OnInit {
  @Input() citaId?: number; // si se provee, el componente entra en modo edición
  @ViewChild('form') formGroup!: any; // referencia al formulario (opcional)

  formConfigs = signal<FieldConfig[]>([]);
  cita?: Cita;
  loading = false;
  submitted = false;

  displayedColumns = ['paciente', 'medico', 'fecha_cita', 'hora_cita', 'motivo_consulta']
  citas = signal<Cita[]>([]);

  form = new FormGroup({});

  private citaService = inject(CitaService);
  private pacienteService = inject(PacienteService);
  private horarioMedicoService = inject(HorarioMedicoService);
  private snackBar = inject(MatSnackBar);
  public matcher = new FormErrorStateMatcher();

  private formService = inject(FormService);

  ngOnInit(): void {
    // Cargar opciones de pacientes y médicos
    var pacientes = this.pacienteService.getEntityList();
    var horarios = this.horarioMedicoService.getEntityList();
    // Inicializar el FormGroup a partir del fieldConfig
    var newConfig = this.formService.newCitasControls(horarios, pacientes);
    this.formConfigs.update(() => [...newConfig]);
    this.form = this.formService.getFormGroup(newConfig);

    this.citas.set(this.citaService.getEntityList());
  }

  getFormControl(control: string) {
    return this.form.get(control);
  }

 

  patchFormWithCita(cita: Cita): void {
    this.form.patchValue({
      fecha_cita: cita.fecha_cita,
      hora_cita: cita.hora_cita,
      paciente: cita.paciente.id,
      horario_medico: cita.horario_medico.medico.id,
      motivo_consulta: cita.motivo_consulta,
      estado: cita.estado,
    });
  }

  hourValidator(control: any) {
    const hora = parseInt(control.value, 10);
    const isWorkingHour = hora >= 5 && hora <= 22;
    return isWorkingHour ? null : { invalidHour: true };
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor, corrija los errores antes de continuar.', 'Cerrar', {
        duration: 4000,
      });
      return;
    }
    this.loading = true;

    const payload: Cita = {
      id: 0,
      paciente: this.getFormControl("paciente")?.value,
      horario_medico: this.getFormControl("horario_medico")?.value,
      fecha_cita: this.getFormControl("fecha_cita")?.value,
      hora_cita: this.getFormControl("hora_cita")?.value,
      motivo_consulta: this.getFormControl("motivo_consulta")?.value,
      estado: this.getFormControl("estado")?.value,
      fecha_creacion: new Date()
    };

    if (this.citaId) {
      // Actualizar
      this.citaService.updateEntity(payload);
      this.snackBar.open('Error al actualizar la cita.', 'Cerrar', {
        duration: 3000,
      });
      this.loading = false;
    } else {
      // Crear
      this.citaService.pushEntity(payload);
      this.loading = false;
      this.snackBar.open('Cita creada correctamente.', 'Cerrar', {
        duration: 3000,
      });
      this.loading = false;
    }
  }
}
