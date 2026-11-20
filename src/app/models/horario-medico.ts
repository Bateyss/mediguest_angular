import { Medico } from "./medico";

export interface HorarioMedico {
    id: number;
    medico: Medico;
    dia_semana: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    hora_inicio: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0;
    hora_fin: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 0;
}
