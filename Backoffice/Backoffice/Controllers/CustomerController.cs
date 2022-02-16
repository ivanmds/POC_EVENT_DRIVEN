using Backoffice.Clients;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backoffice.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ICustomerClient _customerClient;

        public CustomerController(ICustomerClient customerClient)
        {
            _customerClient = customerClient;
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
    }
}
