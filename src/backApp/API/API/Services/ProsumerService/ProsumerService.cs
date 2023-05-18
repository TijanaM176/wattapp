using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;
using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using API.Repositories.UserRepository;
using API.Services.Auth;

namespace API.Services.ProsumerService
{
    public class ProsumerService : IProsumerService
    {

        private readonly IUserRepository _repository;
     

        public ProsumerService(IUserRepository repository)
        {
            _repository = repository;
        }

        public Task<PagedList<Prosumer>>
            GetProsumers(ProsumerParameters prosumerParameters) // to su sa parametrima page i size 
        {
            return _repository.GetProsumers(prosumerParameters);
        }

        public async Task<Prosumer> GetProsumerById(string id)
        {
            var prosumer = await _repository.GetProsumerById(id);
            return prosumer;

        }

        /*
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            var prosumers = await _repository.GetAllProsumers();
            if (prosumers != null) return prosumers;

            return null;
        }
        */
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            var prosumers = await _repository.GetAllProsumers();
            if (prosumers == null) throw new ArgumentException("No prosumers in database!");

            return prosumers;
        }

        public async Task<bool> DeleteProsumer(string id)
        {
            try
            {
                await _repository.DeleteProsumer(id);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> EditProsumer(string id, ProsumerEdit newValues)
        {
            Prosumer prosumer;
            try
            {
                prosumer = await GetProsumerById(id);
            }
            catch (Exception)
            {
                return false; //ako ne moze da ga nadje, nije editovan
            }



            //sifra
            if (!string.IsNullOrEmpty(newValues.oldPassword) && !string.IsNullOrEmpty(newValues.newPassword))
            {
                var hmac = new HMACSHA512(prosumer.SaltPassword);
                var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newValues.oldPassword));
                if (passwordHash.SequenceEqual(prosumer.HashPassword))
                {
                    // Ako se oldPassword poklapa sa trenutnom, izračunava se novi hash za newPassword
                    var newHmac = new HMACSHA512();
                    prosumer.SaltPassword = newHmac.Key;
                    prosumer.HashPassword = newHmac.ComputeHash(Encoding.UTF8.GetBytes(newValues.newPassword));
                    
                }
                else
                    return false;
                
            }

                try
                {
                   await _repository.Save();
                    return true;
                }
                catch (Exception)
                {
                return false;
                }
        }

        public async Task<List<string>> getEmails()
        {
            var userTask = _repository.GetAllProsumers();
            var dsoTask = _repository.GetAllDsos();

            var users = await userTask;
            var dsos = await dsoTask;

            var emails = users.Select(user => user.Email).Concat(dsos.Select(dso => dso.Email)).ToList();

            return emails;
        }

        public async Task<bool> checkEmail(string email)
        {
            var emails = await getEmails();
            return !emails.Contains(email);
        }

        public async Task<List<Neigborhood>> GetNeigborhoods()
        {
            var neighborhoods = await _repository.GetNeigborhoods();
            if (neighborhoods == null) throw new ArgumentException("No neighborhoods in database!");

            return neighborhoods;
        }

        public async Task<List<Prosumer>> GetProsumersByNeighborhoodId(string id)
        {
            var prosumers = await _repository.GetProsumersByNeighborhoodId(id);
            if (prosumers == null) throw new ArgumentException("No prosumers in that neighborhood!");

            return prosumers;
        }

        public async Task<Boolean> SetCoordinates(SaveCoordsDto saveCoords)
        {

            try
            {

                return await _repository.SetCoordinates(saveCoords);

            }
            catch (Exception)
            {
                return false;
            }

           
        }
        public async Task<List<City>> GetCities()
        {
            return await _repository.GetCities();
        }

        public async Task<Neigborhood> GetNeigborhoodsByID(string id)
        {
            return await _repository.GetNeigborhoodsByID(id);
        }

        public async Task<List<Neigborhood>> GetNeighborhoodByCityId(long CityId)
        {
            List<Neigborhood> neighborhoods = await _repository.GetNeighborhoodByCityId(CityId);
            if (neighborhoods == null) throw new ArgumentException("No neighborhoods!");

            return neighborhoods;
        }


        public async Task<string> GetCityNameById(long id)
        {
            string name = await _repository.GetCityNameById(id);
            if (name == null) throw new ArgumentException("No city for that id!");
            return name;
        }

        public async Task<List<ProsumerLink>> AllLinks(string id)
        {
            var prosumers = await _repository.AllLinks(id);
            if (prosumers == null) throw new ArgumentException("No links for that prosumer!");

            return prosumers;
        }
        public async Task<string> GetNeighborhoodByName(string id)
        {
            string NeigbName = await _repository.GetNeighborhoodByName(id);
            if (NeigbName == null) throw new ArgumentException("No Neighborhood for that id");

            return NeigbName;
        }
        public async Task<string> GetRoleName(long id)
        {
            string roleName = await _repository.GetRoleName(id);
            if (roleName == null) throw new ArgumentException("No Role for that id");

            return roleName;
        }

        public async Task<bool> DeleteImage(String prosumerID)
        {
            bool answer =  await _repository.DeleteImageProsumer(prosumerID);
            if (answer == null) throw new ArgumentException("ERORR DeleteImage");
            return answer;
        }

        public async Task<(String, Boolean)> SaveImage(String ProsumerId, string base64string)
        {
            (String,Boolean) answer = await _repository.SaveImageProsumer(ProsumerId, base64string);
            if (answer.Item2 == false) throw new ArgumentException(answer.Item1);

            return answer;
        }

        public async Task<List<City>> GetCitiesWithProsumers()
        {
            return (await _repository.GetCities()).Where(x => _repository.HasProsumers(x.Id)).ToList();
        }
        public async Task<List<Neigborhood>> GetNeighborhoodsWithProsumersByCityId(long CityId)
        {
            return (await _repository.GetNeighborhoodByCityId(CityId)).Where(x => _repository.HasProsumers(x.Id)).ToList();
        }
    }
}
