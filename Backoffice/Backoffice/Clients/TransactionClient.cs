using Backoffice.Models;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Backoffice.Clients
{
    public class TransactionClient : BaseClient, ITransactionClient
    {
        public const string KEY = "transactionClient";

        public TransactionClient(IHttpClientFactory httpClientFactory)
            : base(KEY, httpClientFactory) { }

        public async Task<List<Transaction>> GetByDocumentNumberAsync(string documentNumber)
        {
            var uri = $"/api/v1/customers/{documentNumber}/transactions";
            return await GetAsync<List<Transaction>>(uri);
        }
    }
}
