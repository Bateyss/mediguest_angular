import { inject, Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../models/util/field-config';
import { SelectOption } from '../../models/util/select-option';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  private formBuilder = inject(UntypedFormBuilder);

  validateFormControls(formm: UntypedFormGroup): boolean {
    var valido = formm.valid;
    var controls = formm.getRawValue();
    for (let index = 0; index < controls.length; index++) {
      if (controls[index]?.enabled && !controls[index]?.valid) valido = false;
    }
    return valido;
  }

  getFormGroup(fields: FieldConfig[]): UntypedFormGroup {
    var formGroupConfigs: any = {};
    if (fields && fields.length > 0) {
      fields.forEach(field => formGroupConfigs[field.name] = [field.value || '', field.validators || []]);
    }

    return this.formBuilder.group(formGroupConfigs);
  }

  newSignInControls(): FieldConfig[] {
    var tiposDocumento: Array<string> = ["DUI", "RESIDENTE", "PASAPORTE"];
    var generos: Array<string> = ["masculino", "femenino", "otros"];
    var roles: Array<string> = ["paciente", "medico", "recepcionista", "administrador"];

    var selectionTipoDocumento: Array<SelectOption> = [];
    var selectionGenero: Array<SelectOption> = [];
    var selectionRol: Array<SelectOption> = [];

    var contador = 1;
    tiposDocumento.forEach(
      modelo => selectionTipoDocumento.push({ id: contador++, name: modelo, value: modelo })
    );
    contador = 1;
    generos.forEach(
      modelo => selectionGenero.push({ id: contador++, name: modelo, value: modelo })
    );
    contador = 1;
    roles.forEach(
      modelo => selectionRol.push({ id: contador++, name: modelo, value: modelo })
    );

    return [
      { id: 1, name: 'nombre', label: 'Nombre', type: 'text', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 2, name: 'apellido', label: 'Apellido', type: 'text', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 3, name: 'tipo_documento', label: 'Tipo de documento', type: 'text', controlType: 'select', validators: [Validators.required], options: selectionTipoDocumento },
      { id: 4, name: 'numero_documento', label: 'Documento', type: 'text', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 5, name: 'numero_telefono', label: 'Numero de telefono', type: 'text', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 6, name: 'email', label: 'Correo electronico', type: 'email', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 7, name: 'genero', label: 'Genero', type: 'text', controlType: 'select', validators: [Validators.required], options: selectionGenero },

      { id: 8, name: 'usuario', label: 'Usuario', type: 'text', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 9, name: 'password', label: 'Contraseña', type: 'password', controlType: 'input', validators: [Validators.required, Validators.minLength(3)], min: 3, label_hint: 'Por serguridad, no introdusca password personal' },
      { id: 10, name: 'genero', label: 'Genero', type: 'text', controlType: 'select', validators: [Validators.required], options: selectionRol },
    ];
  }

  newPacienteControls(usuarios: Array<Usuario>): FieldConfig[] {
    var selectionUsuario: Array<SelectOption> = [];
    usuarios.forEach(
      modelo => selectionUsuario.push({ id: modelo.id, name: modelo.persona.nombre + ' ' + modelo.persona.apellido, value: modelo })
    );
    return [
      { id: 1, name: 'fecha_nacimiento', label: 'Fecha de Nacimiento', type: 'date', controlType: 'datepicker', validators: [Validators.required] },
      { id: 3, name: 'usuario', label: 'Persona', type: 'text', controlType: 'select', validators: [Validators.required], options: selectionUsuario },
    ];
  }
}
