import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialFormDialogModule, MaterialTableDialogModule } from '../../material/material-module';
import { ConsultaMedica } from '../../models/consulta-medica';
import { FieldConfig } from '../../models/util/field-config';
import { HourPipePipe } from '../../pipes/hour-pipe-pipe';
import { CitaService } from '../../service/cita-service';
import { ConsultaMedicaService } from '../../service/consulta-medica-service';
import { ExpedienteService } from '../../service/expediente-service';
import { MedicoService } from '../../service/medico-service';
import { FormService } from '../../service/util/form-service';
import { DataApp } from '../../util/data-app';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { SharedForm } from '../util/shared-form/shared-form';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from '../../util/utils';

@Component({
  selector: 'app-consulta-medica-management-component',
  imports: [
    MaterialFormDialogModule,
    MaterialTableDialogModule,
    MatProgressSpinnerModule,
    HourPipePipe,
    SharedForm
  ],
  templateUrl: './consulta-medica-management-component.html',
  styleUrl: './consulta-medica-management-component.css',
})
export class ConsultaMedicaManagementComponent implements OnInit {

  private consultasService = inject(ConsultaMedicaService);
  private citaService = inject(CitaService);
  private expedienteService = inject(ExpedienteService);
  private medicoService = inject(MedicoService);

  readonly formService = inject(FormService);
  readonly matcher = new FormErrorStateMatcher();

  /** Signals */
  readonly searchTerm = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly filteredConsultas = signal<ConsultaMedica[]>([]);
  readonly searchFormConfigs = signal<FieldConfig[]>([]);
  readonly formConfigs = signal<FieldConfig[]>([]);
  searchForm!: UntypedFormGroup;
  form!: UntypedFormGroup;

  readonly _matSnackBar = inject(MatSnackBar);
  /** Computed derived properties */
  readonly displayedColumns = ['expediente', 'paciente', 'fecha', 'hora', 'motivo', 'edit', 'delete'];

  ngOnInit(): void {
    this.cargaInicial();
  }

  private cargaInicial() {
    this.loading.set(true);
    var consultas = this.consultasService.getEntityList();
    if (consultas && consultas.length) {
      this.filteredConsultas.set(consultas);
      this.createFormConfig();
      this.loading.set(false);
    } else {
      this.loading.set(false);
    }
  }

  private createFormConfig(): void {
    var expedientes = this.expedienteService.getEntityList();
    var medicos = this.medicoService.getEntityList();
    var citas = this.citaService.getEntityList();
    // Simple configuration – adapt to your real fields
    var newcitasConfigs = this.formService.newConsultaControls(expedientes, citas, medicos);
    this.formConfigs.set(newcitasConfigs);
    this.form = this.formService.getFormGroup(newcitasConfigs);
    var newFiltrosConfigs = this.formService.newConsultaFiltrosControls(expedientes, medicos);
    this.searchFormConfigs.set(newFiltrosConfigs);
    this.searchForm = this.formService.getFormGroup(newFiltrosConfigs);
  }

  resetSearch() {
    this.searchForm.reset();
  }

  /** UI actions */
  applyFilter() {
    // reload list based on searchTerm
    this.loading.set(true);
    var consultas = this.consultasService.getEntityList();
    var expediente = this.getFormControlSearch('expediente')?.value;
    var medico = this.getFormControlSearch('medico')?.value;

    if (expediente && expediente.id)
      consultas = consultas.filter(v => v.expediente.id == expediente.id);

    if (medico && medico.id)
      consultas = consultas.filter(v => v.medico.id == medico.id);



    if (consultas && consultas.length) {
      this.filteredConsultas.set(consultas);
      this.loading.set(false);
    } else {
      this.loading.set(false);
      Utils.openSnackBar('No se encontraron registros por filtro', 'ok', this._matSnackBar)
    }
  }

  getFormControl(control: string) {
    return this.form.get(control);
  }

  getFormControlSearch(control: string) {
    return this.searchForm.get(control);
  }

  /** Delete handling */
  delete(id: number) {
    this.consultasService.deleteEntity(id);
    var consultas = this.consultasService.getEntityList();
    this.filteredConsultas.set(consultas);
  }

  /** Edit / view */
  edit(consulta: ConsultaMedica) {
    this.getFormControl('expediente')?.setValue(consulta.expediente);
    this.getFormControl('cita')?.setValue(consulta.cita);
    this.getFormControl('medico')?.setValue(consulta.medico);
    this.getFormControl('fecha_atencion')?.setValue(consulta.fecha_atencion);
    this.getFormControl('diagnostico')?.setValue(consulta.diagnostico);
    this.getFormControl('nota_evolucion')?.setValue(consulta.nota_evolucion);
  }

  /** Submit */
  onSubmit() {
    if (this.form?.valid) {
      const payload = this.buildPayloadFromForm(this.form);
      const id = payload.id as number;
      if (id) {
        this.consultasService.updateEntity(payload as ConsultaMedica);
        Utils.openSnackBar('consulta actualizada', 'ok', this._matSnackBar)
      } else {
        this.consultasService.pushEntity(payload as ConsultaMedica);
        Utils.openSnackBar('consulta creada', 'ok', this._matSnackBar)
      }
      this.refreshList()
    }
  }

  private refreshList() {
    this.filteredConsultas.set(this.consultasService.getEntityList());
  }

  private buildPayloadFromForm(formGroup: any): any {
    const value = formGroup.getRawValue();
    return {
      id: value.id,
      expediente: { /* map expediente id to full object or omit */ },
      cita: DataApp.getCitaVacio(),
      medico: DataApp.getMedicoVacio(),
      fecha_atencion: new Date(),
      diagnostico: '',
      nota_evolucion: '',
    };
  }

  /** Helpers for template */
  trackById(index: number, item: ConsultaMedica) {
    return item.id;
  }

  /** Estado de error para inputs */
  isError(controlName: string): boolean {
    const ctrl = this.form?.get(controlName);
    var is = false;
    if (ctrl?.touched && ctrl?.invalid)
      is = true;
    return is;
  }
}
