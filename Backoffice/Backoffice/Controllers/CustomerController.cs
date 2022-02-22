using Backoffice.Clients;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backoffice.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ICustomerClient _customerClient;
        private readonly ITransactionClient _transactionClient;

        public CustomerController(ICustomerClient customerClient, ITransactionClient transactionClient)
        {
            _customerClient = customerClient;
            _transactionClient = transactionClient;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(string documentNumber)
        {
            var customers = await _customerClient.GetByDocumentNumberAsync(documentNumber);
            return View(customers);
        }

        [HttpGet("~/Customer/Details/{customerId}")]
        public async Task<ActionResult> Details(string customerId)
        {
            var customer = await _customerClient.GetByIdAsync(customerId);
            return View(customer);
        }

        [HttpGet("~/Customer/Transactions/{documentNumber}")]
        public async Task<IActionResult> Transactions(string documentNumber)
        {
            var transactions = await _transactionClient.GetByDocumentNumberAsync(documentNumber);
            return View(transactions);
        }
    }
}
