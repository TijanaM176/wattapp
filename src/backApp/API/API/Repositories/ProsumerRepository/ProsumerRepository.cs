using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;

namespace API.Repositories.ProsumerRepository
{
    public class ProsumerRepository : BaseRepository<Prosumer>, IProsumerRepository
    {
        RegContext _context;

        public ProsumerRepository(RegContext context) : base(context)
        {
            _context = context;
        }

      

        
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            return await _context.Prosumers.ToListAsync();
        }


        public async Task<Prosumer> GetProsumer(string usernameOrEmail)
        {
            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }


        public async Task<Prosumer> GetProsumerWithToken(string token)
        {
            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Token == token);
        }



        public async Task InsertProsumer(Prosumer prosumer)
        {
            _context.Prosumers.Add(prosumer);
            await _context.SaveChangesAsync(); // sacuvaj promene
        }


        public async Task<Prosumer> GetProsumerById(string id)
        {


            return await _context.Prosumers.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters)
        {
            return Task.FromResult(PagedList<Prosumer>.GetPagedList(FindAll().OrderBy(i => i.DateCreate), prosumerParameters.PageNumber, prosumerParameters.PageSize));
        }


        public async Task DeleteProsumer(string id)
        {
            _context.Prosumers.Remove(await GetProsumerById(id));
            await _context.SaveChangesAsync();
        }

        public async Task<Boolean> SetCoordinates(SaveCoordsDto saveCoords)
        {
            Prosumer prosumer = await GetProsumer(saveCoords.Username);
            
            if (prosumer == null) return false;
        

            prosumer.Latitude = saveCoords.Latitude;
            prosumer.Longitude = saveCoords.Longitude;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<ProsumerLink>> AllLinks(string id)
        {
            return await _context.ProsumerLinks.ToListAsync();
        }
        public async Task<List<City>> GetCities()
        {

              return await _context.Cities.ToListAsync();
        }
        public async Task<Neigborhood> GetNeigborhoodsByID(string id)
        {
              return await _context.Neigborhoods.FirstOrDefaultAsync(x => x.Id == id);
        }

        /*
        public async Task<List<SelectedNeigborhood>> GetNeighborhoodByCityId(long CityId)
        {
                List<Prosumer> prosumers = await GetAllProsumers();     
                List<SelectedNeigborhood> neigborhoodsByCityId = new List<SelectedNeigborhood>();

                foreach (var prosumer in prosumers)
                {
                    if(prosumer.CityId == CityId)
                    {
                        Neigborhood neigborn =  (Neigborhood)await GetNeigborhoodsByID(prosumer.NeigborhoodId);

                        neigborhoodsByCityId.Add(new SelectedNeigborhood(neigborn.Id, neigborn.NeigbName));
                    }
                }

                return neigborhoodsByCityId;
        }*/

        public async Task<List<Neigborhood>> GetNeighborhoodByCityId(long CityId)
        {
            List<Neigborhood> neighbourhoodsById = new List<Neigborhood>();
            var all = await _context.Neigborhoods.ToListAsync();

            foreach (var n in all)
            {
                if (n.CityId == CityId)
                {
                    neighbourhoodsById.Add(n);
                }
            }
            return neighbourhoodsById;
        }

        public async Task<string> GetCityNameById(long id)
        {
            return (await _context.Cities.FirstOrDefaultAsync(x => x.Id == id)).Name;
        }

        public Task<List<ProsumerLink>> AllLinks(string id)
        {
            throw new NotImplementedException();
        }
    }
    


}
