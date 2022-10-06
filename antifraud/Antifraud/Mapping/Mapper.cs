using System.Collections.Generic;
using Entity = Antifraud.Domain.Entitties;
using VOs = Antifraud.Domain.Entitties.VOs;
using Antifraud.ExternalContracts;
using System.Diagnostics;

namespace Antifraud.Mapping
{
    public class Mapper : IMapper
    {
        private readonly ActivitySource _activitySource;
        public Mapper(ActivitySource activitySource)
        {
            _activitySource = activitySource;
        }

        public Entity.Customer Map(CustomerWasCreated customerWasCreated)
        {
            var activity = _activitySource.StartActivity("Mapper.Map_CustomerWasCreated");
            var customer = new Entity.Customer();
            customer._id = customerWasCreated.Id;
            customer.DocumentNumber = customerWasCreated.DocumentNumber;
            customer.Name = customerWasCreated.Name;
            customer.MotherName = customerWasCreated.MotherName;
            customer.Status = customerWasCreated.Status;
            return customer;
        }

        public Entity.Customer Map(CustomerWasUpdated customerWasUpdated)
        {
            var activity = _activitySource.StartActivity("Mapper.Map_CustomerWasUpdated");
            var customer = new Entity.Customer();
            customer._id = customerWasUpdated.Id;
            customer.DocumentNumber = customerWasUpdated.DocumentNumber;
            customer.Name = customerWasUpdated.Name;
            customer.MotherName = customerWasUpdated.MotherName;
            customer.Status = customerWasUpdated.Status;

            if(customerWasUpdated.Address != null)
            {
                customer.Address = GetAddress(customerWasUpdated.Address);
            }

            if(customerWasUpdated.Contacts?.Count > 0)
            {
                customer.Contacts = GetContact(customerWasUpdated.Contacts);
            }

            return customer;
        }

        private VOs.Address GetAddress(Address address)
        {
            var activity = _activitySource.StartActivity("Mapper.GetAddress");
            var eAddress = new VOs.Address();
            eAddress.Street = address.Street;
            eAddress.City = address.City;
            eAddress.Complement = address.Complement;
            eAddress.Neighborhood = address.Neighborhood;
            eAddress.Number = address.Number;
            eAddress.State = address.State;
            eAddress.ZipCode = address.ZipCode;

            return eAddress;
        }

        private IEnumerable<VOs.Contact> GetContact(List<Contract> contracts)
        {
            var activity = _activitySource.StartActivity("Mapper.GetContact");
            foreach (var contact in contracts)
            {
                yield return new VOs.Contact() { Value = contact.Value, Type = contact.Type };
            }
        }
    }
}
