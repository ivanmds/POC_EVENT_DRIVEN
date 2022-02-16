using Backoffice.Models;
using System.Threading.Tasks;

namespace Backoffice.Clients
{
    public interface ICustomerClient
    {
        Task<Customer> GetByDocument
    }
}
