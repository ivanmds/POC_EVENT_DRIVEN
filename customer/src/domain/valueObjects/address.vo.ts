export class Address {
    constructor(
        public street: string,
        public number: string,
        public neighborhood: string,
        public zipCode: string,
        public city: string,
        public state: string,
        public complement: string
    ) { }
}