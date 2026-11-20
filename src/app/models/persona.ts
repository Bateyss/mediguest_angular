import { EntityModel } from "../service/core/abstract-service";

export interface Persona extends EntityModel {
    id: number;
    nombre: string;
    apellido: string;
    tipo_documento: "DUI" | "RESIDENTE" | "PASAPORTE";
    numero_documento: string;
    numero_telefono: string;
    email: string;
    genero: "masculino" | "femenino" | "otros"
}
