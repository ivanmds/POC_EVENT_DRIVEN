using Backoffice.Models.Types;
using Backoffice.Models.VOs;
using System;
using System.Collections.Generic;

namespace Backoffice.Models
{
    public class Customer
    {
        public string Id { get; set; }
        public string DocumentNumber { get; set; }
        public string Name { get; set; }
        public string MotherName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime Created { get; set; }
        public CustomerStatusType Status { get; set; }
        public Address Address { get; set; }
        public IEnumerable<Contact> Contacts { get; set; }
    }
}
