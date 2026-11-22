import { inject, Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Cita } from '../../models/cita';
import { ConsultaMedica } from '../../models/consulta-medica';
import { Expediente } from '../../models/expediente';
import { HorarioMedico } from '../../models/horario-medico';
import { Medico } from '../../models/medico';
import { Paciente } from '../../models/paciente';
import { Usuario } from '../../models/usuario';
import { FieldConfig } from '../../models/util/field-config';
import { SelectOption } from '../../models/util/select-option';

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

  newHorariosControls(medicos: Array<Medico>): FieldConfig[] {
    var dias = [{ "nombre": "Lunes", "valor": 1 },
    { "nombre": "Martes", "valor": 2 },
    { "nombre": "Miercoles", "valor": 3 },
    { "nombre": "Jueves", "valor": 4 },
    { "nombre": "Viernes", "valor": 5 },
    { "nombre": "Sabado", "valor": 6 },
    { "nombre": "Domingo", "valor": 7 },
    ];
    var horas = [];
    for (let index = 0; index < 24; index++) {
      horas.push(index);
    }

    var selectionMedico: Array<SelectOption> = [];
    var selectionDia: Array<SelectOption> = [];
    var selectionHoraInicio: Array<SelectOption> = [];
    var selectionHoraFin: Array<SelectOption> = [];
    medicos.forEach(
      modelo => selectionMedico.push({ id: modelo.id, name: modelo.usuario.persona.nombre + ' ' + modelo.usuario.persona.apellido, value: modelo })
    );
    dias.forEach(
      modelo => selectionDia.push({ id: modelo.valor, name: modelo.nombre, value: modelo.valor })
    );
    horas.forEach(
      modelo => {
        selectionHoraInicio.push({ id: modelo, name: ' ' + modelo, value: modelo });
        selectionHoraFin.push({ id: modelo, name: ' ' + modelo, value: modelo })
      }
    );
    return [
      { id: 1, name: 'medico', label: 'Medico', type: 'text', controlType: 'select', validators: [Validators.required], options: selectionMedico },
      { id: 2, name: 'dia_semana', label: 'Dia de semana', type: 'number', controlType: 'select', validators: [Validators.required], options: selectionDia },
      { id: 3, name: 'hora_inicio', label: 'Hora inicio', type: 'number', controlType: 'select', validators: [Validators.required], options: selectionHoraInicio },
      { id: 4, name: 'hora_fin', label: 'Hora Fin', type: 'number', controlType: 'select', validators: [Validators.required], options: selectionHoraFin },
    ];
  }

  newCitasControls(medicos: Array<HorarioMedico>, pacientes: Array<Paciente>): FieldConfig[] {
    var selectionMedico: Array<SelectOption> = [];
    var selectionPaciente: Array<SelectOption> = [];
    medicos.forEach(
      modelo => selectionMedico.push({ id: modelo.id, name: modelo.medico?.usuario?.persona?.nombre + ' ' + modelo.medico?.usuario?.persona?.apellido, value: modelo })
    );
    pacientes.forEach(
      modelo => selectionPaciente.push({ id: modelo.id, name: modelo.usuario?.persona?.nombre + ' ' + modelo.usuario?.persona?.apellido, value: modelo })
    );
    return [
      {
        id: 1,
        label: 'Fecha de la cita',
        type: 'date',
        controlType: 'datepicker',
        name: 'fecha_cita',
        validators: [Validators.required],
        label_hint: 'Seleccione la fecha',
      },
      {
        id: 2,
        label: 'Hora de la cita',
        type: 'number',
        controlType: 'select',
        name: 'hora_cita',
        validators: [Validators.required],
        options: [
          { id: 13, name: '05:00', value: 5 },
          { id: 14, name: '06:00', value: 6 },
          { id: 15, name: '07:00', value: 7 },
          { id: 1, name: '08:00', value: 8 },
          { id: 2, name: '09:00', value: 9 },
          { id: 3, name: '10:00', value: 10 },
          { id: 4, name: '08:00', value: 11 },
          { id: 5, name: '11:00', value: 12 },
          { id: 6, name: '12:00', value: 13 },
          { id: 7, name: '13:00', value: 14 },
          { id: 8, name: '14:00', value: 15 },
          { id: 9, name: '15:00', value: 16 },
          { id: 10, name: '16:00', value: 17 },
          { id: 11, name: '17:00', value: 18 },
          { id: 12, name: '19:00', value: 19 },
          { id: 13, name: '20:00', value: 20 },
          { id: 14, name: '21:00', value: 21 },
          { id: 15, name: '22:00', value: 22 }
        ],
        label_hint: 'Seleccione la hora',
      },
      {
        id: 3,
        label: 'Paciente',
        type: 'text',
        controlType: 'select',
        name: 'paciente',
        validators: [Validators.required],
        options: selectionPaciente, // se poblará dinámicamente
        label_hint: 'Seleccione el paciente',
      },
      {
        id: 4,
        label: 'Médico',
        type: 'text',
        controlType: 'select',
        name: 'horario_medico',
        validators: [Validators.required],
        options: selectionMedico, // se poblará dinámicamente
        label_hint: 'Seleccione el médico',
      },
      {
        id: 5,
        label: 'Motivo de la consulta',
        type: 'text',
        controlType: 'input',
        name: 'motivo_consulta',
        validators: [Validators.required],
        label_hint: 'Breve descripción del motivo',
      },
      {
        id: 6,
        label: 'Estado',
        type: 'text',
        controlType: 'select',
        name: 'estado',
        validators: [Validators.required],
        options: [
          { id: 1, name: 'programado', value: 'programado' },
          { id: 2, name: 'reprogramado', value: 'reprogramado' },
          { id: 3, name: 'finalizada', value: 'finalizada' },
          { id: 4, name: 'cancelada', value: 'cancelada' }],
        label_hint: 'Seleccione el estado',
      },
    ];
  }

  newConsultaFiltrosControls(expedientes: Array<Expediente>, medicos: Array<Medico>): FieldConfig[] {
    var selectionMedico: Array<SelectOption> = [];
    var selectionExpediente: Array<SelectOption> = [];
    medicos.forEach(
      modelo => selectionMedico.push({ id: modelo.id, name: modelo.usuario?.persona?.nombre + ' ' + modelo.usuario?.persona?.apellido, value: modelo })
    );
    expedientes.forEach(
      modelo => selectionExpediente.push({ id: modelo.id, name: modelo.fecha_apertura + ' ' + modelo.paciente?.usuario?.persona?.nombre + ' ' + modelo.paciente?.usuario?.persona?.apellido, value: modelo })
    );
    return [
      {
        id: 1,
        label: 'Expediente',
        type: 'text',
        controlType: 'select',
        name: 'expediente',
        validators: [],
        options: selectionExpediente, // se poblará dinámicamente
        label_hint: 'Seleccione el expediente',
      },
      {
        id: 2,
        label: 'Médico',
        type: 'text',
        controlType: 'select',
        name: 'medico',
        validators: [],
        options: selectionMedico, // se poblará dinámicamente
        label_hint: 'Seleccione el médico',
      },
    ];
  }

  newConsultaControls(expedientes: Array<Expediente>, citas: Array<Cita>, medicos: Array<Medico>): FieldConfig[] {
    var selectionMedico: Array<SelectOption> = [];
    var selectionCita: Array<SelectOption> = [];
    var selectionExpediente: Array<SelectOption> = [];
    medicos.forEach(
      modelo => selectionMedico.push({ id: modelo.id, name: modelo.usuario?.persona?.nombre + ' ' + modelo.usuario?.persona?.apellido, value: modelo })
    );
    citas.forEach(
      modelo => selectionCita.push({ id: modelo.id, name: modelo.fecha_cita + ' ' + modelo.paciente?.usuario?.persona?.nombre + ' ' + modelo.paciente?.usuario?.persona?.apellido, value: modelo })
    );
    expedientes.forEach(
      modelo => selectionExpediente.push({ id: modelo.id, name: modelo.fecha_apertura + ' ' + modelo.paciente?.usuario?.persona?.nombre + ' ' + modelo.paciente?.usuario?.persona?.apellido, value: modelo })
    );
    return [
      {
        id: 1,
        label: 'Expediente',
        type: 'text',
        controlType: 'select',
        name: 'expediente',
        validators: [Validators.required],
        options: selectionExpediente, // se poblará dinámicamente
        label_hint: 'Seleccione el expediente',
      },
      {
        id: 2,
        label: 'Cita',
        type: 'text',
        controlType: 'select',
        name: 'cita',
        validators: [Validators.required],
        options: selectionCita, // se poblará dinámicamente
        label_hint: 'Seleccione el expediente',
      },
      {
        id: 3,
        label: 'Médico',
        type: 'text',
        controlType: 'select',
        name: 'medico',
        validators: [Validators.required],
        options: selectionMedico, // se poblará dinámicamente
        label_hint: 'Seleccione el médico',
      },
      {
        id: 4,
        name: 'fecha_atencion', label: 'Fecha de atencion',
        type: 'date', controlType: 'datepicker',
        validators: [Validators.required]
      },
      {
        id: 5,
        name: 'diagnostico', label: 'Diagnostico',
        type: 'text', controlType: 'input',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3
      },
      {
        id: 6,
        name: 'nota_evolucion', label: 'Nota de evolucion',
        type: 'text', controlType: 'input',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3
      },
    ];
  }

  newFechaControl(): FieldConfig[] {
    return [
      {
        id: 1,
        name: 'fecha', label: 'Fecha de Nacimiento',
        type: 'date', controlType: 'datepicker',
        validators: [Validators.required]
      },
    ];
  }

  newExpedienteControls(pacientes: Array<Paciente>): FieldConfig[] {
    var selectionPaciente: Array<SelectOption> = [];
    pacientes.forEach(
      modelo => selectionPaciente.push({ id: modelo.id, name: modelo.usuario?.persona?.nombre + ' ' + modelo.usuario?.persona?.apellido, value: modelo })
    );
    return [
      {
        id: 1,
        label: 'Paciente',
        type: 'text',
        controlType: 'select',
        name: 'paciente',
        validators: [Validators.required],
        options: selectionPaciente, // se poblará dinámicamente
        label_hint: 'Seleccione el paciente',
      },
      { id: 2, name: 'antecedentes_medicos', label: 'Antecedentes Medicos', type: 'text', controlType: 'textarea', validators: [Validators.required, Validators.minLength(3)], min: 3 },
      { id: 3, name: 'alergias', label: 'Alergias', type: 'text', controlType: 'textarea', validators: [Validators.required, Validators.minLength(3)], min: 3 },
    ];
  }

  newRecetaControls(consultas: Array<ConsultaMedica>): FieldConfig[] {
    var selectionConsulta: Array<SelectOption> = [];
    consultas.forEach(
      modelo => selectionConsulta.push({ id: modelo.id, name: modelo.expediente?.paciente?.usuario?.persona?.nombre + ' ' + modelo.cita?.motivo_consulta, value: modelo })
    );
    return [
      {
        id: 1,
        label: 'Consulta',
        type: 'text',
        controlType: 'select',
        name: 'consulta',
        validators: [Validators.required],
        options: selectionConsulta, // se poblará dinámicamente
        label_hint: 'Seleccione una consulta',
      },
      {
        id: 2,
        name: 'fecha_emision', label: 'Fecha de emision',
        type: 'date', controlType: 'datepicker',
        validators: [Validators.required]
      },
      {
        id: 3,
        name: 'indicaciones_generales', label: 'Indicaciones generales',
        type: 'text', controlType: 'textarea',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3
      },
    ];
  }

  newDetalleRecetaControls(): FieldConfig[] {

    return [
      {
        id: 1,
        name: 'nombre_medicamento', label: 'Nombre Medicamento',
        type: 'text', controlType: 'input',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3
      },
      {
        id: 2,
        name: 'dosis', label: 'Dosis',
        type: 'text', controlType: 'input',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3, label_hint: '50ml / 1 tableta'
      },
      {
        id: 3,
        name: 'frecuencia', label: 'fecuencia',
        type: 'text', controlType: 'input',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3, label_hint: '2 veces al dia'
      },
      {
        id: 4,
        name: 'duracion', label: 'Duracion',
        type: 'text', controlType: 'input',
        validators: [Validators.required, Validators.minLength(3)]
        , min: 3, label_hint: '10 dias'
      },
    ];
  }
}
