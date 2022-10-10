using System.Diagnostics;
using Antifraud.AnalysisResults;
using Antifraud.Domain.Entitties;
using Antifraud.ExternalContracts;

namespace Antifraud.Domain.Services
{
    public class AntifraudService
    {
        private readonly ActivitySource _activitySource;

        public AntifraudService(ActivitySource activitySource)
        {
            _activitySource = activitySource;
        }

        public AnalysisResult PixTransactionAnalysis(Customer customer)
        {
            using var activity = _activitySource.StartActivity("AntifraudService.PixTransactionAnalysis", ActivityKind.Internal);
            return customer is null ? AnalysisResult.CustomerError : customer.Status == CustomerStatusType.Simple ? AnalysisResult.Disapproved : AnalysisResult.Approved;
        }
    }
}
