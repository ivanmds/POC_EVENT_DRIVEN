using Backoffice.Models;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Backoffice.Clients
{
    public class CustomerClient : BaseClient, ICustomerClient
    {
        public const string KEY = "customerClient";

        public CustomerClient(IHttpClientFactory httpClientFactory)
            : base(KEY, httpClientFactory) { }

        public async Task<List<Customer>> GetByDocumentNumberAsync(string documentNumber)
        {
            var uri = $"/api/v1/snapshot-customers/{documentNumber}";
            return await GetAsync<List<Customer>>(uri);
        }

        public async Task<Customer> GetByIdAsync(string customerId)
        {
            var uri = $"/api/v1/customers/{customerId}";
            return await GetAsync<Customer>(uri);
        }
    }
}
