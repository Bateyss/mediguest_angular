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
    public static readonly LOGGED_USUARIO: string = 'usuario';

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

    private static personaList: Persona[] = [];
    private static usuarioList: Usuario[] = [];
    private static medicoList: Medico[] = [];
    private static pacienteList: Paciente[] = [];
    private static horarioMedicoList: HorarioMedico[] = [];
    private static citaList: Cita[] = [];
    private static expedienteList: Expediente[] = [];
    private static consultaMedicaList: ConsultaMedica[] = [];
    private static recetaMedicaList: RecetaMedica[] = [];
    private static detalleRecetaList: DetalleReceta[] = [];

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
            horario_medico: this.getHorarioVacio(),
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

    static getUsuarioAnonimo(): Usuario {
        return {
            id: 1,
            persona: this.getPersonaVacio(),
            usuario: 'anonim',
            password: 'anonim',
            rol: "paciente",
            estado: "activo",
        }
    }

    // ########################################################################################################
    // asd
    // ########################################################################################################

    static getPersonaListRandom(): Array<Persona> {
        var datosList: Array<Persona> = [];
        if (this.personaList.length)
            datosList = this.personaList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    nombre: 'nom' + Utils.randomString(10),
                    apellido: 'ape' + Utils.randomString(10),
                    tipo_documento: Utils.randomSelect(["DUI", "RESIDENTE", "PASAPORTE"]),
                    numero_documento: 'doc' + Utils.randomString(10),
                    numero_telefono: 'tel' + Utils.randomString(10),
                    email: 'emai' + Utils.randomString(10),
                    genero: Utils.randomSelect(["masculino", "femenino", "otros"])
                });
            }
        this.personaList = datosList;
        return datosList;
    }

    static getUsuarioListRandom(): Array<Usuario> {
        var datosList: Array<Usuario> = [];
        if (this.usuarioList.length)
            datosList = this.usuarioList
        else {
            datosList.push(this.getUsuarioAnonimo())
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 2,
                    persona: Utils.randomSelect(this.getPersonaListRandom()),
                    usuario: 'usu' + Utils.randomString(10),
                    password: 'pass' + Utils.randomString(10),
                    rol: Utils.randomSelect(["paciente", "medico", "recepcionista"]),
                    estado: "activo",
                });
            }
        }
        this.usuarioList = datosList;
        return datosList;
    }

    static getMedicoListRandom(): Array<Medico> {
        var datosList: Array<Medico> = [];
        if (this.medicoList.length)
            datosList = this.medicoList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    usuario: Utils.randomSelect(this.getUsuarioListRandom(), 1),
                    especialidad: 'esp' + Utils.randomString(10),
                    numero_junta_vigilancia: 'jun' + Utils.randomString(10),
                });
            }
        this.medicoList = datosList;
        return datosList;
    }

    static getPacienteListRandom(): Array<Paciente> {
        var datosList: Array<Paciente> = [];
        if (this.pacienteList.length)
            datosList = this.pacienteList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    usuario: Utils.randomSelect(this.getUsuarioListRandom(), 1),
                    fecha_registro: new Date(),
                    fecha_ultima_visita: new Date(),
                    fecha_nacimiento: new Date(),
                });
            }
        this.pacienteList = datosList;
        return datosList;
    }

    static getHorarioListRandom(): Array<HorarioMedico> {
        var datosList: Array<HorarioMedico> = [];
        if (this.horarioMedicoList.length)
            datosList = this.horarioMedicoList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    medico: Utils.randomSelect(this.getMedicoListRandom()),
                    dia_semana: Utils.randomInt(7, 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
                    hora_inicio: Utils.randomInt(23) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0,
                    hora_fin: Utils.randomInt(23) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0,
                });
            }
        this.horarioMedicoList = datosList;
        return datosList;
    }

    static getCitaListRandom(): Array<Cita> {
        var datosList: Array<Cita> = [];
        if (this.citaList.length)
            datosList = this.citaList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    paciente: Utils.randomSelect(this.getPacienteListRandom()),
                    horario_medico: Utils.randomSelect(this.getHorarioListRandom()),
                    fecha_cita: new Date(),
                    hora_cita: Utils.randomInt(23) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0,
                    estado: "programado",
                    motivo_consulta: 'mot' + Utils.randomString(10),
                    fecha_creacion: new Date(),
                });
            }
        this.citaList = datosList;
        return datosList;
    }

    static getExpedienteListRandom(): Array<Expediente> {
        var datosList: Array<Expediente> = [];
        if (this.expedienteList.length)
            datosList = this.expedienteList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    paciente: Utils.randomSelect(this.getPacienteListRandom()),
                    fecha_apertura: new Date(),
                    antecedentes_medicos: 'ant' + Utils.randomString(10),
                    alergias: 'ale' + Utils.randomString(10),
                });
            }
        this.expedienteList = datosList;
        return datosList;
    }

    static getConsultaListRandom(): Array<ConsultaMedica> {
        var datosList: Array<ConsultaMedica> = [];
        if (this.consultaMedicaList.length)
            datosList = this.consultaMedicaList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    expediente: Utils.randomSelect(this.getExpedienteListRandom()),
                    cita: Utils.randomSelect(this.getCitaListRandom()),
                    medico: Utils.randomSelect(this.getMedicoListRandom()),
                    fecha_atencion: new Date(),
                    diagnostico: 'diag' + Utils.randomString(10),
                    nota_evolucion: 'nota' + Utils.randomString(10),
                });
            }
        this.consultaMedicaList = datosList;
        return datosList;
    }

    static getRecetaListRandom(): Array<RecetaMedica> {
        var datosList: Array<RecetaMedica> = [];
        if (this.recetaMedicaList.length)
            datosList = this.recetaMedicaList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    consulta: Utils.randomSelect(this.getConsultaListRandom()),
                    fecha_emision: new Date(),
                    indicaciones_generales: 'ind' + Utils.randomString(10),
                });
            }
        this.recetaMedicaList = datosList;
        return datosList;
    }

    static getDetalleRecetaListRandom(): Array<DetalleReceta> {
        var datosList: Array<DetalleReceta> = [];
        if (this.detalleRecetaList.length)
            datosList = this.detalleRecetaList
        else
            for (let index = 0; index < Utils.randomInt(100, 25); index++) {
                datosList.push({
                    id: index + 1,
                    receta: Utils.randomSelect(this.getRecetaListRandom()),
                    nombre_medicamento: 'medi' + Utils.randomString(10),
                    dosis: 'dosis' + Utils.randomString(10),
                    frecuencia: 'frec' + Utils.randomString(10),
                    duracion: 'dur' + Utils.randomString(10),
                });
            }
        this.detalleRecetaList = datosList;
        return datosList;
    }

}
