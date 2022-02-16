using Backoffice.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backoffice.Clients
{
    public interface ICustomerClient
    {
        Task<List<Customer>> GetByDocumentNumberAsync(string documentNumber);
    }
}
