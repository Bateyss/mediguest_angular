import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialFormDialogModule, MaterialTableDialogModule } from '../../material/material-module';
import { Expediente } from '../../models/expediente';
import { Paciente } from '../../models/paciente';
import { FieldConfig } from '../../models/util/field-config';
import { ExpedienteService } from '../../service/expediente-service';
import { PacienteService } from '../../service/paciente-service';
import { FormService } from '../../service/util/form-service';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { SharedForm } from '../util/shared-form/shared-form';
import { Utils } from '../../util/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expediente-form-component',
  imports: [MaterialFormDialogModule,
    MaterialTableDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule],
  templateUrl: './expediente-form-component.html',
  styleUrl: './expediente-form-component.css',
})
export class ExpedienteFormComponent implements OnInit {
  /** Inyección de servicios */
  private fb = inject(FormBuilder);
  private expedienteSrv = inject(ExpedienteService);
  private pacienteSrv = inject(PacienteService);
  private dialog = inject(MatDialog);

  /** Estado reactivo */
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'paciente', 'antecedentes_medicos', 'alergias','acciones'];
  pacientes = signal<Paciente[]>([]);
  expedientes = signal<Expediente[]>([]);
  filtro = signal<string>('');

  /** Formulario dinámico construido a partir de field-config */
  form!: FormGroup;
  fieldConfig: FieldConfig[] = [
    {
      id: 1,
      name: 'observaciones',
      label: 'Observaciones',
      type: 'text',
      controlType: 'input',
      validators: [Validators.maxLength(200)],
    },
    // En un escenario real podríamos añadir más campos (fecha, etc.)
  ];

  /** Error matcher inyectado */
  errorMatcher = new FormErrorStateMatcher();

  /** Carga inicial de datos */
  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarExpedientes();
  }


  private cargarPacientes(): void {
    this.filtro.set('');
    this.pacientes.set(this.pacienteSrv.getEntityList());
    if (!this.pacientes().length) {
      this.error.set('Error al cargar pacientes');
    }
  }

  private cargarExpedientes(): void {
    this.filtro.set('');
    this.expedientes.set(this.expedienteSrv.getEntityList());
    if (!this.pacientes().length) {
      this.error.set('Error al cargar expedientes');
    }
  }

  /** Cambia el filtro de paciente y vuelve a buscar */
  onPatientFilterChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.filtro.set(term);
    this.filtrarExpedientes();
  }

  /** Filtra expedientes por paciente */
  filtrarExpedientes(): void {
    const term = this.filtro();
    if (!term) {
      this.cargarExpedientes();
      return;
    }
    const lower = term.toLowerCase();
    var listExpedientes = this.expedienteSrv.getEntityList();
    if (listExpedientes && listExpedientes.length) {
      this.expedientes.set(listExpedientes.filter(value => {
        var nombreCompleto = value.paciente.usuario.persona.nombre + ' ' + value.paciente.usuario.persona.apellido;
        return nombreCompleto.toLowerCase().includes(term);
      }));
      if (!this.expedientes().length) {
        this.error.set('Error al filtrar expedientes');
      } else {
        this.error.set(null);
      }
    }
  }

  /** Recarga toda la lista sin filtro */
  recargarTodo(): void {
    this.cargarExpedientes();
  }

  /** Construye el formulario a partir de field-config */
  crearFormulario(): FormGroup {
    const group: { [key: string]: any } = {};
    this.fieldConfig.forEach((cfg) => {
      const validators = cfg.validators ?? [];
      group[cfg.name] = [null, validators];
    });
    return this.fb.group(group);
  }

  /** Obtiene el control a partir del nombre */
  getCfgCtrl(name: string) {
    return this.form.get(name);
  }

  /** Acción “Crear” */
  openCrearDialog(): void {
    this.form = this.crearFormulario();
    const dialogConfig = Utils.getMatDialogConf();
    dialogConfig.data = { mode: 'create' as 'create' | 'edit', expediente: null }
    const dialogRef = this.dialog.open(ExpedienteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        this.recargarTodo();
      });
  }

  /** Acción “Editar” */
  openEditarDialog(expediente: Expediente): void {
    this.form = this.crearFormulario();
    // Pre‑poblamos el formulario con los valores del expediente
    Object.keys(this.fieldConfig).forEach((key) => {
      if (key === 'observaciones') {
        this.form.get(key)!.setValue(expediente.antecedentes_medicos);
      }
    });
    const dialogConfig = Utils.getMatDialogConf();
    dialogConfig.data = {
      mode: 'edit' as 'create' | 'edit',
      expediente: { ...expediente },
    };
    const dialogRef = this.dialog.open(ExpedienteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        this.recargarTodo();
      });
  }

}

@Component({
  selector: 'app-expediente-dialog',
  standalone: true,
  imports: [MaterialFormDialogModule, SharedForm],
  templateUrl: './expediente-form-component.crear.html',
  styleUrl: './expediente-form-component.css',
})
export class ExpedienteDialogComponent implements OnInit {

  private srv = inject(ExpedienteService);
  private pacienteService = inject(PacienteService);
  private dialogRef = inject(MatDialogRef<ExpedienteDialogComponent>);
  data = inject<{ mode: 'create' | 'edit', expediente: Expediente | null }>(MAT_DIALOG_DATA);
  private _matSnackBar = inject(MatSnackBar);


  // FormGroup para el filtro por fecha
  expedienteForm!: FormGroup;
  formConfigs = signal<FieldConfig[]>([]);
  private formService = inject(FormService);

  ngOnInit(): void {
    var pacientes = this.pacienteService.getEntityList();
    // Inicializar el FormGroup a partir del fieldConfig
    var newConfig = this.formService.newExpedienteControls(pacientes);
    this.formConfigs.update(() => [...newConfig]);
    this.expedienteForm = this.formService.getFormGroup(newConfig);
  }

  /** Obtiene el control a partir del nombre */
  getFormControl(control: string) {
    return this.expedienteForm.get(control);
  }

  /** Cancela la apertura del dialog */
  onCancel(): void {
    this.dialogRef.close();
  }

  /** Guarda (crea o actualiza) */
  save(): void {
    if (!this.formService.validateFormControls(this.expedienteForm)) {
      this.expedienteForm.markAllAsTouched();
      return;
    }
    var entity: Expediente = {
      id: 0,
      paciente: this.getFormControl('paciente')!.value,
      fecha_apertura: new Date(),
      antecedentes_medicos: this.getFormControl('antecedentes_medicos')!.value,
      alergias: this.getFormControl('alergias')!.value
    }
    if (this.data.mode === 'create') {
      this.srv.pushEntity(entity);
      Utils.openSnackBar('NUEVO EXPEDIENTE CREADO EXITOSAMENTE', 'aceptar', this._matSnackBar);
    } else {
      if (this.data.expediente) {
        entity.id = this.data.expediente.id;
        this.srv.updateEntity(entity);
        Utils.openSnackBar('NUEVO EXPEDIENTE ACTUALIZADO EXITOSAMENTE', 'aceptar', this._matSnackBar);
      }
    }
    this.dialogRef.close();
  }
}
