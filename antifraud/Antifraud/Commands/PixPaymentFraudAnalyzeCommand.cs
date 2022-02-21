namespace Antifraud.Commands
{
    public class PixPaymentFraudAnalyzeCommand
    {
        public string TransactionCode { get; set; }
        public AccountDto Debit { get; set; }
        public AccountDto Credit { get; set; }
        public decimal Amount { get; set; }
    }

    public class AccountDto
    {
        public string DocumentNumber { get; set; }
        public string Key { get; set; }
    }
}
