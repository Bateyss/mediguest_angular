import { Usuario } from "./usuario";

export interface Medico {
    id: number;
    usuario:Usuario;
    especialidad:string;
    numero_junta_vigilancia:string;
}
