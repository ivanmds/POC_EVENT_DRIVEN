namespace Antifraud.AnalysisResults
{
    public class PixPaymentAnalysis
    {
        public string TransactionCode { get; set; }
        public AnalysisResult Result { get; set; }
    }

    public enum AnalysisResult
    {
        Approved,
        Disapproved,
        CustomerError
    }
}
