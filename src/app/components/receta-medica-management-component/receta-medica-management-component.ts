import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialFormDialogModule, MaterialTableDialogModule } from '../../material/material-module';
import { DetalleReceta } from '../../models/detalle-receta';
import { Paciente } from '../../models/paciente';
import { RecetaMedica } from '../../models/receta-medica';
import { FieldConfig } from '../../models/util/field-config';
import { ConsultaMedicaService } from '../../service/consulta-medica-service';
import { DetalleRecetaService } from '../../service/detalle-receta-service';
import { PacienteService } from '../../service/paciente-service';
import { RecetaMedicaService } from '../../service/receta-medica-service';
import { FormService } from '../../service/util/form-service';
import { DataApp } from '../../util/data-app';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { Utils } from '../../util/utils';
import { SharedForm } from '../util/shared-form/shared-form';

@Component({
  selector: 'app-receta-medica-management-component',
  imports: [
    MaterialFormDialogModule,
    MaterialTableDialogModule,
    MatProgressSpinnerModule,
    SharedForm
  ],
  templateUrl: './receta-medica-management-component.html',
  styleUrl: './receta-medica-management-component.css',
})
export class RecetaMedicaManagementComponent implements OnInit {
  /** Servicio inyectado */
  private readonly recetaSrv = inject(RecetaMedicaService);
  private readonly detalleRecetaSrv = inject(DetalleRecetaService);
  private readonly consultaSrv = inject(ConsultaMedicaService);
  private readonly pacienteSrv = inject(PacienteService);
  /** Service para formar dinámicamente el formulario */
  private readonly formSrv = inject(FormService);
  /** Matcher para errores de formulario */
  readonly errorMatcher = new FormErrorStateMatcher();

  private _snackBar = inject(MatSnackBar);

  /** Lista completa de recetas */
  pacientes = signal<Paciente[]>([]);
  recetas = signal<RecetaMedica[]>([]);
  detallesReceta = signal<DetalleReceta[]>([]);
  /** Lista filtrada que se muestra en la tabla */
  filteredRecetas = signal<RecetaMedica[]>([]);
  /** Texto del filtro de búsqueda */
  filtro = signal<number>(0);

  /** Formulario reactivo */
  form!: FormGroup;
  formDetalle!: FormGroup;

  /** Configuración del formulario basada en FieldConfig */
  formConfig = signal<FieldConfig[]>([]);
  formConfigDetalle = signal<FieldConfig[]>([]);

  /** Columnas de la tabla */
  displayedColumns = signal<string[]>(['edit', 'consulta', 'fecha', 'indicaciones']);
  displayedColumnsDetalle = signal<string[]>(['nombre_medicamento', 'dosis', 'frecuencia', 'duracion']);

  /** Loading state */
  loading = signal<boolean>(true);

  /** Hook del ciclo de vida */
  ngOnInit(): void {
    this.loadRecetas();
    this.createFormConfig();
    this.pacientes.set(this.pacienteSrv.getEntityList())
  }

  /** Carga inicial de recetas */
  private loadRecetas(): void {
    this.loading.set(true);
    var recetas = this.recetaSrv.getEntityList();
    if (recetas && recetas.length) {
      this.recetas.set(recetas);
      this.applyFilter();
    }
    this.loading.set(false);
  }

  getFormControl(control: string) {
    return this.form.get(control);
  }

  getFormControlDetalle(control: string) {
    return this.formDetalle.get(control);
  }

  /** Aplica el filtro de búsqueda */
  applyFilter(): void {
    const pacienteId = this.filtro();
    if (pacienteId < 1) {
      Utils.openSnackBar('Seleccione un paciente', 'ok', this._snackBar)
      return;
    }
    const result = pacienteId
      ? this.recetas()
        .filter(r => r.consulta?.expediente.paciente.id == pacienteId)
      : this.recetas();
    this.filteredRecetas.set(result);
  }

  resetFilter() {
    this.filtro.set(0);
    this.filteredRecetas.set(this.recetaSrv.getEntityList());
  }

  // compara ids del campo select
  compareIds(id1: any, id2: any): boolean {
    return id1.id == id2.id;
  }

  /** Crea la configuración del formulario dinámico */
  createFormConfig(): void {
    // Construcción del form group a partir de la configuración
    var consultas = this.consultaSrv.getEntityList();
    var recetaConfig = this.formSrv.newRecetaControls(consultas);
    var detalleRecetaConfig = this.formSrv.newDetalleRecetaControls();
    this.formConfig.update(() => [...recetaConfig]);
    this.formConfigDetalle.update(() => [...detalleRecetaConfig]);
    this.form = this.formSrv.getFormGroup(recetaConfig);
    this.formDetalle = this.formSrv.getFormGroup(detalleRecetaConfig);
  }

  guardarDetalle() {
    if (!this.formDetalle?.valid) {
      this.formDetalle.markAllAsTouched();
      return;
    }
    const newDetalleReceta: DetalleReceta = {
      id: 0,
      receta: DataApp.getRecetaVacio(),
      nombre_medicamento: this.getFormControlDetalle('nombre_medicamento')!.value,
      dosis: this.getFormControlDetalle('dosis')!.value,
      frecuencia: this.getFormControlDetalle('frecuencia')!.value,
      duracion: this.getFormControlDetalle('duracion')!.value,
    };
    var detalles = this.detallesReceta();
    detalles.push(newDetalleReceta);
    this.detallesReceta.update(() => [...detalles]);
    Utils.openSnackBar('Agregar Detalles de receta', 'ok', this._snackBar);
  }

  /** Acción de crear nueva receta */
  onCreate(): void {
    if (!this.form?.valid) {
      this.form.markAllAsTouched();
      return;
    }
    // validar detalles de receta, tiene que haber por lo menos uno
    var detalles = this.detallesReceta();
    if (!detalles.length) {
      Utils.openSnackBar('Agregar Detalles de receta', 'ok', this._snackBar);
      return;
    }
    const newReceta: RecetaMedica = {
      id: 0,
      consulta: this.getFormControl('consulta')?.value, // se asignará vía UI (ej.: seleccionar consulta)
      fecha_emision: this.form!.get('fecha_emision')!.value,
      indicaciones_generales: this.form!.get('indicaciones_generales')!.value,
    };
    var recetaCreated = this.recetaSrv.pushEntity(newReceta);
    this.recetas.update(list => [newReceta, ...list]);
    for (let detalle of detalles) {
      detalle.receta = recetaCreated;
      this.detalleRecetaSrv.pushEntity(detalle);
    }
    Utils.openSnackBar('Receta y detalles guardados', 'ok', this._snackBar);
    this.loadRecetas();
    this.resetForm();
  }

  /** Acción de editar receta */
  onEdit(receta: RecetaMedica): void {

    this.getFormControl('consulta')?.setValue(receta.consulta);
    this.getFormControl('fecha_emision')?.setValue(receta.fecha_emision);
    this.getFormControl('indicaciones_generales')?.setValue(receta.indicaciones_generales);

    var detallesAll = this.detalleRecetaSrv.getEntityList();
    var detalleFiltered = detallesAll.filter(v => v.receta.id == receta.id);

    this.detallesReceta.update(() => [...detalleFiltered]);
  }

  /** Reset del formulario tras crear */
  private resetForm(): void {
    if (this.form) {
      this.form.reset();
    }
    if (this.formDetalle) {
      this.formDetalle.reset();
    }
  }
}
