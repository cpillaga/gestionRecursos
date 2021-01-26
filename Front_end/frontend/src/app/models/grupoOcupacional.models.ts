export class GrupoOcupacional{ 
    constructor(
        public descripcion: string,
        public minVal: string,
        public maxVal: string,
        public estado: string,
        public empresa: string,
        public _id?: string
    ){}
}