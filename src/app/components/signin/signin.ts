import { Component, DOCUMENT, Inject, inject, OnInit, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialFormDialogModule } from '../../material/material-module';
import { Usuario } from '../../models/usuario';
import { FieldConfig } from '../../models/util/field-config';
import { PersonaService } from '../../service/persona-service';
import { UsuarioService } from '../../service/usuario-service';
import { FormService } from '../../service/util/form-service';
import { DataApp } from '../../util/data-app';
import { FormErrorStateMatcher } from '../../util/form-error-state-matcher';
import { Utils } from '../../util/utils';
import { SharedForm } from '../util/shared-form/shared-form';

@Component({
  selector: 'app-signin',
  imports: [MaterialFormDialogModule, SharedForm],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin implements OnInit {

  public usuarioSeleccionado: Usuario = DataApp.getUsuarioVacio();

  readonly dialogRef = inject(MatDialogRef<Signin>);
  public innerWidths = '0';
  private document = inject(DOCUMENT);

  //forms
  public signinForm!: UntypedFormGroup;

  private _snackBar = inject(MatSnackBar);
  private usuarioService = inject(UsuarioService);
  private personaService = inject(PersonaService);
  private formService = inject(FormService);

  // configuraciones para auto generar formulario 
  public formConfigs = signal<FieldConfig[]>([]);
  public matcher = new FormErrorStateMatcher();

  data = inject<{}>(MAT_DIALOG_DATA);

  ngOnInit() {
    this.innerWidths = (this.document.body.clientWidth * 0.9) + 'px';
    // seteando formulario de pantalla
    var newConfig = this.formService.newSignInControls();
    this.formConfigs.update(() => [...newConfig]);
    this.signinForm = this.formService.getFormGroup(newConfig);
  }

  getFormControl(control: string) {
    return this.signinForm.get(control);
  }

  validarDatos(): boolean {
    var valido = this.formService.validateFormControls(this.signinForm);
    return valido;
  }

  guardarUsuario() {
    if (this.validarDatos()) {

      this.usuarioSeleccionado.persona.nombre = this.getFormControl("nombre")?.value;
      this.usuarioSeleccionado.persona.apellido = this.getFormControl("apellido")?.value;
      this.usuarioSeleccionado.persona.tipo_documento = this.getFormControl("tipo_documento")?.value;
      this.usuarioSeleccionado.persona.numero_documento = this.getFormControl("numero_documento")?.value;
      this.usuarioSeleccionado.persona.numero_telefono = this.getFormControl("numero_telefono")?.value;
      this.usuarioSeleccionado.persona.email = this.getFormControl("email")?.value;
      this.usuarioSeleccionado.persona.genero = this.getFormControl("genero")?.value;
      this.usuarioSeleccionado.usuario = this.getFormControl("usuario")?.value;
      var passEncrypted = '';
      var pass = this.getFormControl("password")?.value;
      if (pass) Utils.generateSHA256(pass).then(b => passEncrypted = b);
      this.usuarioSeleccionado.password = passEncrypted;
      this.usuarioSeleccionado.rol = this.getFormControl("rol")?.value;
      this.usuarioSeleccionado.estado = this.getFormControl("estado")?.value;

      var newPersona = this.personaService.pushEntity(this.usuarioSeleccionado.persona)
      this.usuarioSeleccionado.persona = newPersona;

      this.usuarioService.pushEntity(this.usuarioSeleccionado);
      Utils.openSnackBar('NUEVO USUARIO CREADO EXITOSAMENTE', 'aceptar', this._snackBar);

      this.dialogRef.close();
    }
    else
      Utils.openSnackBar('Datos incorrectos', 'ok', this._snackBar);
  }
}

