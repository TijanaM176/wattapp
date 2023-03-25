using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;

namespace API.Services.ProsumerService
{
    public interface IProsumerService
    {

        Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters);
        public Task<Prosumer> GetProsumerById(string id);
        public Task<List<Prosumer>> GetAllProsumers();
        public Task<bool> DeleteProsumer(string id);
        public Task<bool> EditProsumer(string id, ProsumerEdit newValues);
        public Task<List<string>> getEmails();
        public Task<bool> checkEmail(string email);
        public Task<List<Neigborhood>> GetNeigborhoods();
        public Task<List<Prosumer>> GetProsumersByNeighborhoodId(string id);
        public Task<Boolean> SetCoordinates(SaveCoordsDto saveCoords);
        public Task<List<City>> GetCities();
        public Task<Neigborhood> GetNeigborhoodsByID(string id);
        public Task<List<SelectedNeigborhood>> GetNeighborhoodByCityId(long CityId);
    }
}
