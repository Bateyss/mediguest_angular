import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialFormDialogModule, MaterialFormModule, MaterialTableModelModule } from '../../material/material-module';
import { HorarioMedico } from '../../models/horario-medico';
import { FieldConfig } from '../../models/util/field-config';
import { HorarioMedicoService } from '../../service/horario-medico-service';
import { MedicoService } from '../../service/medico-service';
import { FormService } from '../../service/util/form-service';
import { DataApp } from '../../util/data-app';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { Utils } from '../../util/utils';
import { SharedForm } from '../util/shared-form/shared-form';

@Component({
  selector: 'app-horarios-medicos-component',
  imports: [
    MaterialFormModule,
    FormsModule,
    MaterialTableModelModule,
    MaterialFormDialogModule,
    SharedForm
  ],
  templateUrl: './horarios-medicos-component.html',
  styleUrl: './horarios-medicos-component.css',
})
export class HorariosMedicosComponent implements OnInit {

  private formService = inject(FormService);
  private medicoService = inject(MedicoService);

  displayedColumns = ['nombre', 'apellido', 'dia_semana', 'hora_inicio', 'hora_fin', 'acciones'];
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  schedules = signal<HorarioMedico[]>([]);

  // configuraciones para auto generar formulario
  scheduleForm!: FormGroup;
  formConfigs = signal<FieldConfig[]>([]);
  public matcher = new FormErrorStateMatcher();

  private _snackBar = inject(MatSnackBar);
  currentSchedule: HorarioMedico = DataApp.getHorarioVacio();
  editing = false;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioMedicoService
  ) {
  }

  ngOnInit(): void {
    this.loadSchedules();

    var medicos = this.medicoService.getEntityList();
    var newConfig = this.formService.newHorariosControls(medicos);
    this.formConfigs.update(() => [...newConfig]);
    this.scheduleForm = this.formService.getFormGroup(newConfig);
  }

  loadSchedules(): void {
    this.schedules.update(() => [...this.horarioService.getEntityList() ?? []]);
  }

  createEmptySchedule(): HorarioMedico {
    return DataApp.getHorarioVacio();
  }

  getFormControl(control: string) {
    return this.scheduleForm.get(control);
  }


  validarDatos(): boolean {
    var valido = this.formService.validateFormControls(this.scheduleForm);
    const f = this.scheduleForm.value;
    if (f.hora_inicio >= f.hora_fin) Utils.openSnackBar('Datos inválidos: verifica día, hora inicio < hora fin', 'aceptar', this._snackBar);
    valido = f.hora_inicio < f.hora_fin;
    return valido;
  }

  openForm(schedule?: HorarioMedico): void {
    this.editing = !!schedule;
    this.currentSchedule = schedule ? { ...schedule } : this.createEmptySchedule();
    this.getFormControl("medico")?.setValue(this.currentSchedule.medico);
    this.getFormControl("dia_semana")?.setValue(this.currentSchedule.dia_semana);
    this.getFormControl("hora_inicio")?.setValue(this.currentSchedule.hora_inicio);
    this.getFormControl("hora_fin")?.setValue(this.currentSchedule.hora_fin);
  }

  addSchedule(): void {
    if (!this.validarDatos()) {
      return;
    }

    this.currentSchedule.medico = this.getFormControl("medico")?.value;
    this.currentSchedule.dia_semana = this.getFormControl("dia_semana")?.value;
    this.currentSchedule.hora_inicio = this.getFormControl("hora_inicio")?.value;
    this.currentSchedule.hora_fin = this.getFormControl("hora_fin")?.value;

    if (this.currentSchedule.id) {
      this.horarioService.updateEntity(this.currentSchedule);
    } else {
      this.horarioService.pushEntity(this.currentSchedule);
    }
    Utils.openSnackBar('NUEVO HORARIO CREADO EXITOSAMENTE', 'aceptar', this._snackBar);

    this.loadSchedules();
    this.resetForm();
  }

  deleteSchedule(schedule: HorarioMedico): void {
    if (window.confirm('¿Eliminar este horario?')) {
      this.schedules.update(values => [...this.schedules().filter(s => s.id !== schedule.id)]);
    }
  }

  resetForm(): void {
    this.scheduleForm.reset();
    this.currentSchedule = this.createEmptySchedule();
    this.editing = false;
  }

  trackById(_: number, s: HorarioMedico): number {
    return s.id;
  }

  guardarHorario() { }
}
