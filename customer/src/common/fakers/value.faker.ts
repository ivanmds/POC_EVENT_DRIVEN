const faker = require('faker-br');

export class ValueFaker {

    getDate = () => faker.date.future();
    getString = () => faker.name.findName();
    getNumber = () => faker.finance.amount();

}