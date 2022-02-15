using Antifraud.Api.Domain.Entitties;

namespace Antifraud.Api.Mapping
{
    public interface IMapper
    {
        Customer Map(CustomerWasCreated customerWasCreated);
        Customer Map(CustomerWasUpdated customerWasUpdated);
    }
}
