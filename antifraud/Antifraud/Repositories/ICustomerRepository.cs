using Antifraud.Domain.Entitties;

namespace Antifraud.Repositories
{
    public interface ICustomerRepository
    {
        void InsertOne(Customer customer);
        void ReplaceOne(Customer customer);
        Customer GetByDocumentNumber(string documentNumber);
    }
}
