using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;
using System.Drawing;




namespace API.Repositories.ProsumerRepository
{
    public class ProsumerRepository : BaseRepository<Prosumer>, IProsumerRepository
    {
        RegContext _context;
        private IWebHostEnvironment enviroment;

        public ProsumerRepository(RegContext context, IWebHostEnvironment enviroment) : base(context)
        {
            _context = context;
            this.enviroment = enviroment;
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
            return await _context.Neigborhoods
       .Where(n => n.CityId == CityId)
       .ToListAsync();
        }
        public async Task<string> GetRoleName(long id)
        {
            Role role = await _context.Roles.FirstOrDefaultAsync(x => x.Id == id);
            if (role == null) return null;

            return role.RoleName;
        }
        public async Task<string> GetCityNameById(long id)
        {
            var city = await _context.Cities.FirstOrDefaultAsync(x => x.Id == id);
            if (city == null)
              return null;
            return city.Name;
        }
        public async Task<string> GetNeighborhoodByName(string id)
        {


            Neigborhood neigborhood =  await _context.Neigborhoods.FirstOrDefaultAsync(x => x.Id == id);
            if (neigborhood == null) return null;

            return neigborhood.NeigbName;
        }
        
        public async Task<bool> DeleteImageProsumer(String ProsumerId)
        {
            var user = await _context.Prosumers.FindAsync(ProsumerId);
            if (user == null || string.IsNullOrEmpty(user.Image))
                return false;
            /*
            // Delete image from server
            var wwwPath = this.enviroment.ContentRootPath;
            var dirPath = Path.Combine(wwwPath, "Uploads");

            // Find all images with the given ProsumerId and allowed extensions
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
            var imagePaths = Directory.EnumerateFiles(dirPath, $"{ProsumerId}.*", SearchOption.TopDirectoryOnly)
                                        .Where(path => allowedExtensions.Contains(Path.GetExtension(path)));

            // Delete all found images
            foreach (var imagePath in imagePaths)
            {
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }

         */
            user.Image = null;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(String,Boolean)> SaveImageProsumer(String ProsumerId, string base64String)
        {

            var user = await GetProsumerById(ProsumerId);
            if (user == null)
                return ("User not found!", false);

           

            user.Image = base64String;

            try
            {
                await _context.SaveChangesAsync();
                return (base64String, true);
            }
            catch (Exception)
            {
                return ("Error saving image to database!", false);
            }
            /*
            var user = await GetProsumerById(ProsumerId);
            if (user == null)
                return ("User not found!",false);

            // Check allowed extensions
            var ext = Path.GetExtension(imageFile.FileName);
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(ext))
                return ("Extension is not allowed!",false);

      
  
                // pročitaj sadržaj datoteke u byte array
             try{    
                byte[] imageBytes;
                using (var stream = new MemoryStream())
                {
                    imageFile.CopyTo(stream);
                    imageBytes = stream.ToArray();
                }

                // konvertuj sliku u Base64 string
                var base64String = Convert.ToBase64String(imageBytes);
                user.Image = base64String;

                // vrati Base64 string kao drugi element n-torke
                await _context.SaveChangesAsync();
                return (base64String, true);
            }
            catch (Exception exc)
            {
                return ("String is not save!",false);
            }*/

        }

        public bool HasProsumers(long cityId)
        {
            if (_context.Prosumers.Where(x => x.CityId == cityId).Any()) return true;
            return false;
        }

        public bool HasProsumers(string neighborhoodId)
        {
            if (_context.Prosumers.Where(x => x.NeigborhoodId == neighborhoodId).Any()) return true;
            return false;
        }
    }

}
