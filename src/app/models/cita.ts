import { Medico } from "./medico";
import { Paciente } from "./paciente";

export interface Cita {
    id: number;
    paciente:Paciente;
    medico:Medico;
    fecha_cita:Date;
    hora_cita:1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|0;
    estado:"programado"|"reprogramado"|"finalizada"|"cancelada";
    motivo_consulta:string;
    fecha_creacion:Date;
}
