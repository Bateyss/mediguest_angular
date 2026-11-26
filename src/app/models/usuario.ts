import { Persona } from "./persona";

export interface Usuario {
    id: number;
    persona: Persona;
    usuario: string;
    password: string;
    rol: "paciente" | "medico" | "recepcionista" | "administrador";
    estado: "activo" | "inactivo";
}
