using Antifraud.Domain.Entitties;

namespace Antifraud.Mapping
{
    public interface IMapper
    {
        Customer Map(CustomerWasCreated customerWasCreated);
        Customer Map(CustomerWasUpdated customerWasUpdated);
    }
}
