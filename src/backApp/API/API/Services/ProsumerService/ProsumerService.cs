using System.Security.Cryptography;
using System.Text;
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

            if (newValues.Email.Length > 0)
            {
                if (prosumer.Email.Equals(newValues.Email) || await checkEmail(newValues.Email))
                    prosumer.Email = newValues.Email;
                else
                    return false; //mejl vec postoji
            }

            //sifra
            if (newValues.Password.Length > 0) { 

                var hmac = new HMACSHA512();
                byte[] passwordSalt = hmac.Key;
                byte[] passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newValues.Password));
                prosumer.HashPassword = passwordHash;
                prosumer.SaltPassword = passwordSalt;
            }

            if (newValues.FirstName.Length > 0) prosumer.FirstName = newValues.FirstName;
            if (newValues.LastName.Length > 0) prosumer.LastName = newValues.LastName;

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
            List<string> emails = new List<string>();
            var users = await _repository.GetAllProsumers();
            foreach (var user in users)
                emails.Add(user.Email);
            var dsos = await _repository.GetAllDsos();
            foreach (var dso in dsos)
                emails.Add(dso.Email);

            return emails;
        }

        public async Task<bool> checkEmail(string email)
        {
            var emails = await getEmails();
            foreach (var e in emails)
                if (e.Equals(email))
                    return false;

            return true;
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
        public async Task<bool> DeleteImage(String prosumerID)
        {
            bool answer =  await _repository.DeleteImageProsumer(prosumerID);
            if (answer == null) throw new ArgumentException("ERORR DeleteImage");
            return answer;
        }

        public async Task<(String, Boolean)> SaveImage(String ProsumerId, IFormFile imageFile)
        {
            (String,Boolean) answer = await _repository.SaveImageProsumer(ProsumerId, imageFile);
            if (answer.Item2 == false) throw new ArgumentException(answer.Item1);

            return answer;
        }

        public async Task<bool> ToggleActivity(string deviceId)
        {
            var device = await _repository.getDevice(deviceId);
            if (device == null) throw new ArgumentException("Device not found!");

            if (device.Activity == true) device.Activity = false;
            else device.Activity = true;

            try
            {
                await _repository.Save();
                return device.Activity;
            }
            catch (Exception)
            {
                throw new ArgumentException("Changes could not be saved!");
            }
        }
    }
}
