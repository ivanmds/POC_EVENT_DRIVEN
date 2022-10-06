using System.Diagnostics;
using Antifraud.Domain.Entitties;
using MongoDB.Driver;

namespace Antifraud.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<Customer> _mongoCollection;
        private readonly ActivitySource _activitySource;

        public CustomerRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _database = _mongoClient.GetDatabase("antifraud");
            _mongoCollection = _database.GetCollection<Customer>("customers");
        }

        public Customer GetByDocumentNumber(string documentNumber)
        {
            var activity = _activitySource.StartActivity("CustomerRepository.GetByDocumentNumber");
            return _mongoCollection.Find(c => c.DocumentNumber == documentNumber).FirstOrDefault();
        }

        public void InsertOne(Customer customer)
        {
            var activity = _activitySource.StartActivity("CustomerRepository.InsertOne");
            _mongoCollection.InsertOne(customer);
        }

        public void ReplaceOne(Customer customer)
        {
            var activity = _activitySource.StartActivity("CustomerRepository.ReplaceOne");
            _mongoCollection.ReplaceOne(m => m._id == customer._id, customer);
        }
    }
}
