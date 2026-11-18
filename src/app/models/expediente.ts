import { Paciente } from "./paciente";

export interface Expediente {
    id: number;
    paciente: Paciente;
    fecha_apertura: Date;
    antecedentes_medicos: string;
    alergias: string;
}
