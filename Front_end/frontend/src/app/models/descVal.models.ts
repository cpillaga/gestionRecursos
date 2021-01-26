export class Competencia{ 
    constructor(
        public descripcion: string,
        public observacion: string,
        public calificacion: string,
        public valorizacion: string,
        public empresa: string,
        public _id?: string
    ){}
}