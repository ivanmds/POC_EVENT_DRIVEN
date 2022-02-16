using System;
using System.Collections.Generic;

namespace Antifraud.Domain.Entitties
{
    public class Customer : BaseEntity
    {
        public string DocumentNumber { get; set; }
        public string Name { get; set; }
        public string MotherName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime Created { get; set; }
        public CustomerStatusType Status { get; set; }
        public VOs.Address Address { get; set; }
        public IEnumerable<VOs.Contact> Contacts { get; set; }
    }
}
