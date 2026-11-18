import { RecetaMedica } from "./receta-medica";

export interface DetalleReceta {
    id: number;
    receta:RecetaMedica;
    nombre_medicamento:string;
    dosis:string;
    frecuencia:string;
    duracion:string;
}
