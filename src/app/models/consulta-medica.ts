import { Cita } from "./cita";
import { Expediente } from "./expediente";
import { Medico } from "./medico";

export interface ConsultaMedica {
    id: number;
    expediente: Expediente;
    cita: Cita;
    medico: Medico;
    fecha_atencion: Date;
    diagnostico: string;
    nota_evolucion: string;
}
