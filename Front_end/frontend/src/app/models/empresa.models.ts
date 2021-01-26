export class Empresa{ 
    constructor(
        public ruc: string,
        public razonSocial: string,
        public telefono: string,
        public direccion: string,
        public correo: string,
        public img: string,
        public fechaIngreso: string,
        public estado: string,
        public estadoPago: string,
        public _id?: string
    ){}
}