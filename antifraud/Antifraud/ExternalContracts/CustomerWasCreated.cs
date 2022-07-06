using System;

namespace Antifraud.ExternalContracts
{
    public class CustomerWasCreated
    {
        public string Id { get; set; }
        public string DocumentNumber { get; set; }
        public string Name { get; set; }
        public string MotherName { get; set; }
        public CustomerStatusType Status { get; set; }
    }
}