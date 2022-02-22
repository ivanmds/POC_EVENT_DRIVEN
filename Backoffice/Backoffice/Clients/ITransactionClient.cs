using Backoffice.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backoffice.Clients
{
    public interface ITransactionClient
    {
        Task<List<Transaction>> GetByDocumentNumberAsync(string documentNumber);
    }
}
