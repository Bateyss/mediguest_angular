import { Component, DOCUMENT, Inject, inject, OnInit, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialFormDialogModule, MaterialTableModelModule } from '../../material/material-module';
import { Paciente } from '../../models/paciente';
import { FieldConfig } from '../../models/util/field-config';
import { PacienteService } from '../../service/paciente-service';
import { UsuarioService } from '../../service/usuario-service';
import { FormService } from '../../service/util/form-service';
import { DataApp } from '../../util/data-app';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { Utils } from '../../util/utils';
import { SharedForm } from '../util/shared-form/shared-form';

@Component({
  selector: 'app-pacientes',
  imports: [MaterialTableModelModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css',
})
export class Pacientes implements OnInit {

  public pacienteList = signal<Array<Paciente>>([]);
  private pacienteService = inject(PacienteService);

  private dialog = inject(MatDialog);

  constructor() {
  }

  ngOnInit(): void {
    this.pacienteList.update(() => [...this.pacienteService.getEntityList()]);
  }

  crearPaciente() {
    const dialogConfig = Utils.getMatDialogConf()
    dialogConfig.data = {
      paciente: DataApp.getPacienteVacio()
    };
    const dialogRef = this.dialog.open(CrearPaciente, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        this.pacienteList.update(() => [...this.pacienteService.getEntityList()]);
      });
  }
  editarPaciente(paciente: Paciente) {
    const dialogConfig = Utils.getMatDialogConf()
    dialogConfig.data = {
      paciente: paciente
    };
    const dialogRef = this.dialog.open(CrearPaciente, dialogConfig);
    dialogRef.afterClosed().subscribe(
      result => {
        this.pacienteList.update(() => [...this.pacienteService.getEntityList()]);
      });
  }
}

@Component({
  selector: 'app-pacientes-crear',
  imports: [MaterialFormDialogModule, SharedForm],
  templateUrl: './pacientes_crear.html',
  styleUrl: './pacientes.css',
  providers: [provideNativeDateAdapter(),
  ]
})
export class CrearPaciente implements OnInit {

  public pacienteSeleccionado: Paciente = DataApp.getPacienteVacio();

  readonly dialogRef = inject(MatDialogRef<CrearPaciente>);
  public innerWidths = '0';
  private document = inject(DOCUMENT);

  //forms
  public pacienteForm!: UntypedFormGroup;

  private _snackBar = inject(MatSnackBar);
  private usuarioService = inject(UsuarioService);
  private pacienteService = inject(PacienteService);
  private formService = inject(FormService);

  // configuraciones para auto generar formulario 
  public formConfigs = signal<FieldConfig[]>([]);
  public matcher = new FormErrorStateMatcher();

  data = inject<{ paciente: Paciente | null }>(MAT_DIALOG_DATA);

  ngOnInit() {
    this.innerWidths = (this.document.body.clientWidth * 0.9) + 'px';
    this.pacienteSeleccionado = this.data.paciente ? this.data.paciente : this.pacienteSeleccionado;
    var usuarios = this.usuarioService.getEntityList();
    // seteando formulario de pantalla
    var newConfig = this.formService.newPacienteControls(usuarios);
    this.formConfigs.update(() => [...newConfig]);
    this.pacienteForm = this.formService.getFormGroup(newConfig);
    this.cargarDatosPaciente();
  }

  getFormControl(control: string) {
    return this.pacienteForm.get(control);
  }

  validarDatos(): boolean {
    var valido = this.formService.validateFormControls(this.pacienteForm);
    var usuario = this.getFormControl("usuario")?.value;
    if (usuario.id < 2) {
      Utils.openSnackBar('Seleccione una persona correctamente', 'ok', this._snackBar);
      valido = false;
    }
    return valido;
  }

  guardarPaciente() {
    if (this.validarDatos()) {
      this.pacienteSeleccionado.usuario = this.getFormControl("usuario")?.value;
      this.pacienteSeleccionado.fecha_nacimiento = new Date(this.getFormControl("fecha_nacimiento")?.value);
      if (this.pacienteSeleccionado.id) {
        this.pacienteService.updateEntity(this.pacienteSeleccionado);
      } else {
        this.pacienteService.pushEntity(this.pacienteSeleccionado);
      }
      Utils.openSnackBar('NUEVO PACIENTE CREADO EXITOSAMENTE', 'aceptar', this._snackBar);

      this.dialogRef.close();
    }
    else
      Utils.openSnackBar('Datos incorrectos', 'ok', this._snackBar);
  }

  cargarDatosPaciente() {
    this.getFormControl("usuario")?.setValue(this.pacienteSeleccionado.usuario);
    this.getFormControl("fecha_nacimiento")?.setValue(this.pacienteSeleccionado.fecha_nacimiento);
  }
}
