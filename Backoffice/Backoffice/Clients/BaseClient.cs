using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

namespace Backoffice.Clients
{
    public abstract class BaseClient
    {
        protected IHttpClientFactory _httpClientFactory;
        protected HttpClient _httpClient;

        protected BaseClient(string clientName, IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _httpClient = httpClientFactory.CreateClient(clientName);
        }

        protected async Task<TResult> GetAsync<TResult>(string uri) where TResult : class
        {
            var response = await _httpClient.GetAsync(uri);
            var responseBody = await response.Content.ReadAsStringAsync();
            
            if (response.IsSuccessStatusCode)
                return JsonConvert.DeserializeObject<TResult>(responseBody);

            throw new System.Exception(responseBody);
        }
    }
}
