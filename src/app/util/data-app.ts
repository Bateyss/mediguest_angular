import { Cita } from "../models/cita";
import { ConsultaMedica } from "../models/consulta-medica";
import { DetalleReceta } from "../models/detalle-receta";
import { Expediente } from "../models/expediente";
import { HorarioMedico } from "../models/horario-medico";
import { Medico } from "../models/medico";
import { Paciente } from "../models/paciente";
import { Persona } from "../models/persona";
import { RecetaMedica } from "../models/receta-medica";
import { Usuario } from "../models/usuario";
import { Utils } from "./utils";

export class DataApp {
    static readonly LOGGED: string = 'logged';

    static readonly PERSONA_ID: string = 'personaList';
    static readonly USUARIO_ID: string = 'usuarioList';
    static readonly MEDICO_ID: string = 'medicoList';
    static readonly PACIENTE_ID: string = 'pacienteList';
    static readonly HORARIO_ID: string = 'horarioList';
    static readonly CITA_ID: string = 'citaList';
    static readonly EPEDIENTE_ID: string = 'expedienteList';
    static readonly CONSULTA_ID: string = 'consultaList';
    static readonly RECETA_ID: string = 'recetaList';
    static readonly DETALLE_RECETA_ID: string = 'detalleRecetaList';

    static getPersonaVacio(): Persona {
        return {
            id: 0,
            nombre: '',
            apellido: '',
            tipo_documento: "DUI",
            numero_documento: '',
            numero_telefono: '',
            email: '',
            genero: "masculino"
        }
    }

    static getUsuarioVacio(): Usuario {
        return {
            id: 0,
            persona: this.getPersonaVacio(),
            usuario: '',
            password: '',
            rol: "paciente",
            estado: "activo",
        }
    }

    static getMedicoVacio(): Medico {
        return {
            id: 0,
            usuario: this.getUsuarioVacio(),
            especialidad: '',
            numero_junta_vigilancia: '',
        }
    }

    static getPacienteVacio(): Paciente {
        return {
            id: 0,
            usuario: this.getUsuarioVacio(),
            fecha_registro: new Date(),
            fecha_ultima_visita: new Date(),
            fecha_nacimiento: new Date(),
        }
    }

    static getHorarioVacio(): HorarioMedico {
        return {
            id: 0,
            medico: this.getMedicoVacio(),
            dia_semana: 1,
            hora_inicio: 1,
            hora_fin: 1,
        }
    }

    static getCitaVacio(): Cita {
        return {
            id: 0,
            paciente: this.getPacienteVacio(),
            medico: this.getMedicoVacio(),
            fecha_cita: new Date(),
            hora_cita: 1,
            estado: "programado",
            motivo_consulta: '',
            fecha_creacion: new Date(),
        }
    }

    static getExpedienteVacio(): Expediente {
        return {
            id: 0,
            paciente: this.getPacienteVacio(),
            fecha_apertura: new Date(),
            antecedentes_medicos: '',
            alergias: '',
        }
    }

    static getConsultaVacio(): ConsultaMedica {
        return {
            id: 0,
            expediente: this.getExpedienteVacio(),
            cita: this.getCitaVacio(),
            medico: this.getMedicoVacio(),
            fecha_atencion: new Date(),
            diagnostico: '',
            nota_evolucion: '',
        }
    }

    static getRecetaVacio(): RecetaMedica {
        return {
            id: 0,
            consulta: this.getConsultaVacio(),
            fecha_emision: new Date(),
            indicaciones_generales: '',
        }
    }

    static getDetalleRecetaVacio(): DetalleReceta {
        return {
            id: 0,
            receta: this.getRecetaVacio(),
            nombre_medicamento: '',
            dosis: '',
            frecuencia: '',
            duracion: '',
        }
    }

    // ########################################################################################################
    // asd
    // ########################################################################################################

    static getPersonaListRandom(): Array<Persona> {
        var datosList: Array<Persona> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                nombre: Utils.randomString(10),
                apellido: Utils.randomString(10),
                tipo_documento: Utils.randomSelect(["DUI", "RESIDENTE", "PASAPORTE"]),
                numero_documento: Utils.randomString(10),
                numero_telefono: Utils.randomString(10),
                email: Utils.randomString(10),
                genero: Utils.randomSelect(["masculino", "femenino", "otros"])
            });
        }
        return datosList;
    }

    static getUsuarioListRandom(): Array<Usuario> {
        var datosList: Array<Usuario> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                persona: Utils.randomSelect(this.getPersonaListRandom()),
                usuario: Utils.randomString(10),
                password: Utils.randomString(10),
                rol: Utils.randomSelect(["paciente", "medico", "recepcionista"]),
                estado: "activo",
            });
        }
        return datosList;
    }

    static getMedicoListRandom(): Array<Medico> {
        var datosList: Array<Medico> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                usuario: Utils.randomSelect(this.getUsuarioListRandom()),
                especialidad: Utils.randomString(10),
                numero_junta_vigilancia: Utils.randomString(10),
            });
        }
        return datosList;
    }

    static getPacienteListRandom(): Array<Paciente> {
        var datosList: Array<Paciente> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                usuario: Utils.randomSelect(this.getUsuarioListRandom()),
                fecha_registro: new Date(),
                fecha_ultima_visita: new Date(),
                fecha_nacimiento: new Date(),
            });
        }
        return datosList;
    }

    static getHorarioListRandom(): Array<HorarioMedico> {
        var datosList: Array<HorarioMedico> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                medico: Utils.randomSelect(this.getMedicoListRandom()),
                dia_semana: Utils.randomInt(7, 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
                hora_inicio: Utils.randomInt(23) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0,
                hora_fin: Utils.randomInt(23) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0,
            });
        }
        return datosList;
    }

    static getCitaListRandom(): Array<Cita> {
        var datosList: Array<Cita> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                paciente: Utils.randomSelect(this.getPacienteListRandom()),
                medico: Utils.randomSelect(this.getMedicoListRandom()),
                fecha_cita: new Date(),
                hora_cita: Utils.randomInt(23) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0,
                estado: "programado",
                motivo_consulta: Utils.randomString(10),
                fecha_creacion: new Date(),
            });
        }
        return datosList;
    }

    static getExpedienteListRandom(): Array<Expediente> {
        var datosList: Array<Expediente> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                paciente: Utils.randomSelect(this.getPacienteListRandom()),
                fecha_apertura: new Date(),
                antecedentes_medicos: Utils.randomString(10),
                alergias: Utils.randomString(10),
            });
        }
        return datosList;
    }

    static getConsultaListRandom(): Array<ConsultaMedica> {
        var datosList: Array<ConsultaMedica> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                expediente: Utils.randomSelect(this.getExpedienteListRandom()),
                cita: Utils.randomSelect(this.getCitaListRandom()),
                medico: Utils.randomSelect(this.getMedicoListRandom()),
                fecha_atencion: new Date(),
                diagnostico: Utils.randomString(10),
                nota_evolucion: Utils.randomString(10),
            });
        }
        return datosList;
    }

    static getRecetaListRandom(): Array<RecetaMedica> {
        var datosList: Array<RecetaMedica> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                consulta: Utils.randomSelect(this.getConsultaListRandom()),
                fecha_emision: new Date(),
                indicaciones_generales: Utils.randomString(10),
            });
        }
        return datosList;
    }

    static getDetalleRecetaListRandom(): Array<DetalleReceta> {
        var datosList: Array<DetalleReceta> = [];
        for (let index = 0; index < Utils.randomInt(10, 1); index++) {
            datosList.push({
                id: index,
                receta: Utils.randomSelect(this.getRecetaListRandom()),
                nombre_medicamento: Utils.randomString(10),
                dosis: Utils.randomString(10),
                frecuencia: Utils.randomString(10),
                duracion: Utils.randomString(10),
            });
        }
        return datosList;
    }

}
