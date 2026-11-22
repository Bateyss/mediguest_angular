import { UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialFormDialogModule, MaterialTableDialogModule } from '../../material/material-module';
import { Cita } from '../../models/cita';
import { HourPipePipe } from '../../pipes/hour-pipe-pipe';
import { CitaService } from '../../service/cita-service';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { FieldConfig } from '../../models/util/field-config';
import { FormService } from '../../service/util/form-service';
import { SharedForm } from '../util/shared-form/shared-form';

@Component({
  selector: 'app-agenda-citas-component',
  imports: [
    HourPipePipe,
    UpperCasePipe,
    MaterialFormDialogModule,
    MaterialTableDialogModule,
    MatProgressSpinnerModule,
    SharedForm
  ],
  templateUrl: './agenda-citas-component.html',
  styleUrl: './agenda-citas-component.css',
  providers: [provideNativeDateAdapter()]
})
export class AgendaCitasComponent implements OnInit {

  displayedColumns = ['id', 'horarioMedico', 'paciente', 'estado'];

  private citaService = inject(CitaService);

  // Señal que contiene la lista de citas obtenidas
  citas = signal<Cita[]>([]);
  // Señal de carga (spinner)
  loading = signal<boolean>(true);
  // Señal de error general
  error = signal<string | null>(null);

  // FormGroup para el filtro por fecha
  fechaForm!: FormGroup;
  formConfigs = signal<FieldConfig[]>([]);
  private formService = inject(FormService);

  // Error matcher para los inputs del formulario
  errorMatcher = new FormErrorStateMatcher();

  ngOnInit(): void {
    // Inicializar el FormGroup a partir del fieldConfig
    var newConfig = this.formService.newFechaControl();
    this.formConfigs.set(newConfig);
    this.fechaForm = this.formService.getFormGroup(newConfig);
    this.cargarCitas();
  }

  getFormControl(control: string) {
    return this.fechaForm.get(control);
  }

  private cargarCitas(): void {
    const fecha = this.getFormControl('fecha')!.value;
    if (!fecha) {
      this.citas.set(this.citaService.getEntityList());
      this.loading.set(false);
      return;
    }
    this.citas.set(this.citaService.getCitasPorFecha(fecha));
    if (this.citas().length) {
      this.loading.set(false);
      this.error.set(null);
    } else {
      this.error.set('No se encontraron registros');
      this.loading.set(false);
    }
  }

  /** Se ejecuta cada vez que el usuario cambia la fecha seleccionada */
  onFechaChange(): void {
    if (this.fechaForm.valid) {
      this.cargarCitas();
    }
  }

  limpiarFiltro() {
    this.fechaForm.get('fecha')!.setValue(null);
    this.error.set(null);
    this.cargarCitas();
  }
}
