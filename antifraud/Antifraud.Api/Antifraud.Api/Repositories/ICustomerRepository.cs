using Antifraud.Api.Domain.Entitties;

namespace Antifraud.Api.Repositories
{
    public interface ICustomerRepository
    {
        void InsertOne(Customer customer);
        void ReplaceOne(Customer customer);
    }
}
