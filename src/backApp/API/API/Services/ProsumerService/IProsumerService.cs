using API.Models.Devices;
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
        public Task<List<Neigborhood>> GetNeighborhoodByCityId(long CityId);
        public Task<string> GetCityNameById(long id);
        public Task<List<ProsumerLink>> AllLinks(string id);
        public Task<string> GetNeighborhoodByName(string id);
        public Task<(String, Boolean)> SaveImage(String ProsumerId, string base64string);
        public Task<bool> DeleteImage(String prosumerID);
        public Task<string> GetRoleName(long id);
        public Task<List<City>> GetCitiesWithProsumers();
        public Task<List<Neigborhood>> GetNeighborhoodsWithProsumersByCityId(long CityId);
    }
}
