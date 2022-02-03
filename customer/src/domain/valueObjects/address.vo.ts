export class Address {
    constructor(
        private address: string,
        private number: string,
        private neighborhood: string,
        private zipCode: string,
        private city: string,
        private state: string,
        private complement: string
    ) { }

    public get getAddress() {
        return this.address;
    }

    public get getNumber() {
        return this.number;
    }

    public get getNeighborhood() {
        return this.neighborhood;
    }

    public get getZipCode() {
        return this.zipCode;
    }

    public get getCity() {
        return this.city;
    }

    public get getState() {
        return this.state;
    }

    public get getComplement() {
        return this.complement;
    }
}