using System;
using System.Collections.Generic;

namespace Antifraud.ExternalContracts
{
    public class CustomerWasUpdated
    {
        public string Id { get; set; }
        public string DocumentNumber { get; set; }
        public string Name { get; set; }
        public string MotherName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime Created { get; set; }
        public CustomerStatusType Status { get; set;}
        public DateTime Updated { get; set; }
        public Address Address { get; set; }
        public List<Contract> Contacts { get; set; }
    }

    public class Address
    {
        public string Street { get; set; }
        public string Number { get; set; }
        public string Neighborhood  { get; set; }
        public string ZipCode  { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Complement { get; set; }
    }

    public class Contract
    {
        public string Value { get; set; }
        public ContactType Type { get; set; }
    }
}