using API.Models.Paging;

namespace API.Services
{
    public interface IProsumerService
    {

        Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters);
        public Task<Prosumer> GetProsumerById(string id);
        public Task<List<Prosumer>> GetAllProsumers();
    }
}
