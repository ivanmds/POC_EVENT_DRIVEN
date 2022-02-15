using Google.Protobuf.Collections;
using System.Collections.Generic;
using Entity = Antifraud.Api.Domain.Entitties;
using VO = Antifraud.Api.Domain.Entitties.VO;

namespace Antifraud.Api.Mapping
{
    public class Mapper : IMapper
    {
        public Entity.Customer Map(CustomerWasCreated customerWasCreated)
        {
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

        private VO.Address GetAddress(Address address)
        {
            var eAddress = new VO.Address();
            eAddress.Street = address.Street;
            eAddress.City = address.City;
            eAddress.Complement = address.Complement;
            eAddress.Neighborhood = address.Neighborhood;
            eAddress.Number = address.Number;
            eAddress.State = address.State;
            eAddress.ZipCode = address.ZipCode;

            return eAddress;
        }

        private IEnumerable<VO.Contact> GetContact(RepeatedField<global::Contract> contracts)
        {
            foreach(var contact in contracts)
            {
                yield return new VO.Contact() { Value = contact.Value, Type = contact.Type };
            }
        }
    }
}
