using back.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace back.Services
{
    public class BooksService
    {
        private readonly IMongoCollection<Book> booksCollection;
        public BooksService(IOptions<booksDbSettings> booksDbSettings)
        {
            var mongoClient = new MongoClient(booksDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(booksDbSettings.Value.DatabaseName);
            booksCollection = mongoDatabase.GetCollection<Book>(booksDbSettings.Value.BooksCollectionName);
        }

        public async Task<List<Book>> GetAllBooksAsync()
        {
            return await booksCollection.Find(_ => true).ToListAsync();
        }

        public async Task<Book> GetBookAsync(string id)
        {
            return await booksCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task InsertBookAsync(Book newBook)
        {
            await booksCollection.InsertOneAsync(newBook);
        }

        public async Task UpdateBookAsync(string id, Book updatedBook)
        {
            Book b = await booksCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
            updatedBook.Title = b.Title;
            await booksCollection.ReplaceOneAsync(x => x.Id == id, updatedBook);
        }

        public async Task RemoveBookAsync(string id)
        { 
            await booksCollection.DeleteOneAsync(x => x.Id == id);
        }
    }
}
