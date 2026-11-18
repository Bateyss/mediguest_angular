import { ConsultaMedica } from "./consulta-medica";

export interface RecetaMedica {
    id: number;
    consulta:ConsultaMedica;
    fecha_emision:Date;
    indicaciones_generales:string;
}
