export class Usuario{ 
    constructor(
        public nombre: string, 
        public usu: string, 
        public correo: string, 
        public estado: string, 
        public password: string, 
        public empresa: string,
        public rol: string,
        public _id?: string
    ){}
}