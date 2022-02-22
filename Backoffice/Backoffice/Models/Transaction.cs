using Backoffice.Models.VOs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backoffice.Models
{
    public class Transaction
    {
        public string TransactionCode { get; set; }
        public decimal Amount { get; set; }
        public List<string> Status { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public Account Debit { get; set; }
        public Account Credit { get; set; }

        public string LastStatus => Status.LastOrDefault();
    }
}
