import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cita } from '../../models/cita';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FieldConfig } from '../../models/util/field-config';
import { CitaService } from '../../service/cita-service';
import { PacienteService } from '../../service/paciente-service';
import { MedicoService } from '../../service/medico-service';
import { FormService } from '../../service/util/form-service';
import { MaterialFormDialogModule } from '../../material/material-module';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cita-management-component',
  imports: [
    MaterialFormDialogModule,
    MatProgressSpinnerModule
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

  form = new FormGroup({});

  private citaService = inject(CitaService);
  private pacienteService = inject(PacienteService);
  private medicoService = inject(MedicoService);
  private snackBar = inject(MatSnackBar);
  public matcher = new FormErrorStateMatcher();

  private formService = inject(FormService);

  constructor(
  ) { }

  ngOnInit(): void {
    // Cargar opciones de pacientes y médicos
    var pacientes = this.pacienteService.getEntityList();
    var medicos = this.medicoService.getEntityList();
    // Inicializar el FormGroup a partir del fieldConfig
    var newConfig = this.formService.newCitasControls(medicos, pacientes);
    this.formConfigs.update(() => [...newConfig]);
    this.form = this.formService.getFormGroup(newConfig);
  }

  getFormControl(control: string) {
    return this.form.get(control);
  }

  compareIds(id1: any, id2: any): boolean {
    return id1.id == id2.id;
  }

  patchFormWithCita(cita: Cita): void {
    this.form.patchValue({
      fecha_cita: cita.fecha_cita,
      hora_cita: cita.hora_cita,
      paciente: cita.paciente.id,
      medico: cita.medico.id,
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
    if (this.form.invalid) {
      this.snackBar.open('Por favor, corrija los errores antes de continuar.', 'Cerrar', {
        duration: 4000,
      });
      return;
    }
    this.loading = true;

    const payload: Cita = {
      id: 0,
      paciente: this.getFormControl("paciente")?.value,
      medico: this.getFormControl("medico")?.value,
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
