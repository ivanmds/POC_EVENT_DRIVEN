using Antifraud.Domain.Entitties;
using Antifraud.ExternalContracts;

namespace Antifraud.Mapping
{
    public interface IMapper
    {
        Customer Map(CustomerWasCreated customerWasCreated);
        Customer Map(CustomerWasUpdated customerWasUpdated);
    }
}
