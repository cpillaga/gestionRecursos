export class Puesto{ 
    constructor(
        public codigo: string,
        public denominacion: string,
        public estado: string,
        public mision: string,
        public nivel: string,
        public unidadAdmin: string,
        public RIE: string,
        public capacitacion: string,
        public rol: string,
        public grado: string,
        public grupoOcupacional: string,
        public ambito: string,
        public empresa: string,
        public _id?: string
    ){}
}