export class ActividadPuesto{ 
    constructor(
        public descripcion: string,
        public tipo: string,
        public actividad: string,
        public puesto: string,
        public estado: string,
        public empresa: string,
        public _id?: string
    ){}
}