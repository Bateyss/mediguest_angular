import { Usuario } from "./usuario";

export interface Paciente {
    id: number;
    usuario: Usuario;
    fecha_registro: Date;
    fecha_ultima_visita: Date;
    fecha_nacimiento: Date;
}
