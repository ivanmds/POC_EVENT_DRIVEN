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

        [HttpGet]
        public async Task<ActionResult> Details(string customerId)
        {
            return View();
        }
    }
}
