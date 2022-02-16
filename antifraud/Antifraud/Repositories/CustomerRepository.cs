using Antifraud.Domain.Entitties;
using MongoDB.Driver;

namespace Antifraud.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<Customer> _mongoCollection;

        public CustomerRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _database = _mongoClient.GetDatabase("antifraud");
            _mongoCollection = _database.GetCollection<Customer>("customers");
        }

        public void InsertOne(Customer customer)
        {
            _mongoCollection.InsertOne(customer);
        }

        public void ReplaceOne(Customer customer)
        {
            _mongoCollection.ReplaceOne(m => m._id == customer._id, customer);
        }
    }
}
