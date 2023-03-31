using System.Security.Cryptography;
using System.Text;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using Microsoft.AspNetCore.Mvc;
using API.Repositories.UserRepository;
using API.Models.HelpModels;
using System.Diagnostics.Eventing.Reader;
using API.Services.Auth;
using System.Text.RegularExpressions;

namespace API.Services.DsoService
{
    public class DsoService : IDsoService
    {
        private readonly IUserRepository _repository;
        public DsoService(IUserRepository repository)
        {
            _repository = repository;
           
        }


       
        public async Task<bool> DeleteDsoWorker(string id)
        {
            try
            {
                await _repository.DeleteDsoWorker(id);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<Dso> GetDsoWorkerById(string id)
        {
            var dso = await _repository.GetDsoWorkerById(id);
            if (dso == null) throw new ArgumentException("No dso found with this id!");

            return dso;
        }

        public async Task<bool> EditDsoWorker(string id, DsoEdit newValues)
        {
            Dso dso;
            try
            {
                dso = await GetDsoWorkerById(id);
            }
            catch (Exception)
            {
                return false;       //ako ne moze da ga nadje, nije editovan
            }

            if (newValues.Email.Length > 0)
            {
                if (dso.Email.Equals(newValues.Email) || await checkEmail(newValues.Email))
                    dso.Email = newValues.Email;
                else
                    return false;
            }

            //sifra
            if (newValues.Password.Length > 0)
            {
                var hmac = new HMACSHA512();
                byte[] passwordSalt = hmac.Key;
                byte[] passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newValues.Password));
                dso.SaltPassword = passwordSalt;
                dso.HashPassword = passwordHash;
            }

            if (newValues.FirstName.Length > 0) dso.FirstName = newValues.FirstName;
            if (newValues.LastName.Length > 0) dso.LastName = newValues.LastName;
            if (newValues.Salary > 0) dso.Salary = newValues.Salary;

            var roles = await GetRoleIds();
            var regions = await GetRegionIds();
            if (roles.Contains(newValues.RoleId)) dso.RoleId = newValues.RoleId;
            if (regions.Contains(newValues.RegionId)) dso.RegionId = newValues.RegionId;

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

        public async Task<List<long>> GetRoleIds()
        {
            var roles = await _repository.GetRoleIds();
            if (roles == null) throw new ArgumentException("No roles in database!");

            return roles;
            
        }

        public async Task<List<string>> GetRegionIds()
        {
            var regions = await _repository.GetRegionIds();
            if (regions == null) throw new ArgumentException("No regions in database!");

            return regions;

        }

        public async Task<List<Dso>> GetAllDsos()
        {
            var dsos = await _repository.GetAllDsos();
            if (dsos == null) throw new ArgumentException("No dsos in database!");

            return dsos;
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
        public async Task<List<string>> getUsername()
        {
            List<string> username = new List<string>();
            var users = await _repository.GetAllProsumers();
            foreach (var user in users)
                username.Add(user.Username);
            var dsos = await _repository.GetAllDsos();
            foreach (var dso in dsos)
                username.Add(dso.Email);

            return username;
        }

        public async Task<bool> checkUsername(string username)
        {
            var usernames = await getUsername();
            foreach (var un in usernames)
                if (un.Equals(username))
                    return false;

            return true;
        }

        public Task<PagedList<Dso>> GetDsoWorkers(DsoWorkerParameters dsoWorkersParameters) // paging
        {
            return  _repository.GetDsoWorkers(dsoWorkersParameters);
        }

        public async Task<List<Dso>> GetDsoWorkersByRegionId(string RegionID)
        {
            var dsoWorkers = await _repository.GetDsoWorkersByRegionId(RegionID);
            if (dsoWorkers == null) throw new ArgumentException("No found worker for this Region!");

            return dsoWorkers;
        }
        public async Task<List<Dso>> GetWorkersbyRoleId(long RoleID)
        {
            var dsoWorkers = await _repository.GetWorkersbyRoleId(RoleID);
            if (dsoWorkers == null) throw new ArgumentException("No found worker for this Role!");

            return dsoWorkers;
        }
        public async Task<IEnumerable<Dso>> GetWorkerByFilter(string RegionID, long RoleID)
        {
            var dsoWorkers = await _repository.GetWorkerByFilter(RegionID, RoleID);
            if (dsoWorkers == null) throw new ArgumentException("No found worker for this Role and this Region!");

            return dsoWorkers;

        }
        public async Task<List<Role>> GetRoles()
        {
            var roles = await _repository.GetRoles();
            if (roles == null) throw new ArgumentException("No roles in database!");
            return roles;
        }
        public async Task<List<Region>> GetRegions()
        {
            var regions = await _repository.GetRegions();
            if (regions == null) throw new ArgumentException("No regions in database!");
            return regions;
        }

        public async Task<string> GetRoleName(long id)
        {
            var roleName = await _repository.getRoleName(id);
            if (roleName == null) throw new ArgumentException("No role for that id!");
            return roleName;
        }

        public async Task<string> GetRegionName(string id)
        {
            var roleName = await _repository.GetRegionName(id);
            if (roleName == null) throw new ArgumentException("No region for that id!");
            return roleName;
        }
       
        public Boolean IsValidEmail(string email)
        {
            Regex emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", RegexOptions.IgnoreCase);

            return emailRegex.IsMatch(email);
        }

        public async Task<Prosumer> UpdateProsumerByDso(ChangeProsumerbyDSO change)
        {
           
            Prosumer prosumer = await _repository.UpdateProsumerByDso(change);
            if (prosumer == null) return null;


            
            if (change.Username == "")
            {
                if(change.Email == "")
                {
                    if(change.FirstName == "")
                    {
                        if(change.LastName == "")
                        {
                           if(change.CityName == "")
                            {
                                if(change.NeigborhoodName == "")
                                {
                                    if(change.Latitude == "")
                                    {
                                        if(change.Longitude == "")
                                        {
                                           if(change.Address == "")
                                            {
                                                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                                                await _repository.Save();
                                                return prosumer;
                                            }
                                            else
                                            {
                                                prosumer.Address = change.Address;
                                                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                                                await _repository.Save();
                                                return prosumer;

                                            }
                                        }
                                        else
                                        {
                                            prosumer.Longitude = change.Longitude;
                                            prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                                            if(change.Address != "")
                                                prosumer.Address = change.Address;

                                            await _repository.Save();
                                            return prosumer;
                                            //postavi sve
                                        }
                                    }
                                    else
                                    {
                                        prosumer.Latitude = change.Latitude;
                                        if(change.Longitude != "")
                                            prosumer.Longitude = change.Longitude;
                                        if (change.Address != "")
                                            prosumer.Address = change.Address;
                                        prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                                        await _repository.Save();
                                        return prosumer;
                                        //postavi sve
                                    }
                                }
                                else
                                {
                                    Neigborhood neig = await _repository.getNeigborhood(change.NeigborhoodName);          
                                    if(neig == null)
                                        throw new ArgumentException("Neigborhood is not valid!");
                                    if (prosumer.CityId.Equals(neig.CityId))
                                        prosumer.NeigborhoodId = neig.Id;
                                    else
                                        throw new ArgumentException("Neigborhood is not exists in this city!");
                                    if (change.Address != "")
                                        prosumer.Address = change.Address;
                                    if (change.Latitude != "")
                                        prosumer.Latitude = change.Latitude;
                                    if (change.Longitude != "")
                                        prosumer.Longitude = change.Longitude;
                                    prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                                    
                                    await _repository.Save();

                                    return prosumer;
                                }
                            }
                           else
                            {
                                City city = await _repository.getCity(change.CityName);
                                if(city == null)
                                    throw new ArgumentException("City is not valid!");
                               

                                if (change.NeigborhoodName != "")
                                {
                                    Neigborhood neig = await _repository.getNeigborhood(change.NeigborhoodName);
                                    if (city.Id.Equals(neig.CityId))
                                        prosumer.NeigborhoodId = neig.Id;
                                    else
                                        throw new ArgumentException("Neigborhood is not exists in this city!");

                                    if (neig == null)
                                        throw new ArgumentException("Neigborhood is not valid!");
                                    prosumer.NeigborhoodId = neig.Id;
                                }
                                else
                                {
                                    //ako neigb neodgovara gradu!
                                    List<Neigborhood> neigList = await _repository.GetNeighborhoodByCityId(city.Id);
                                    Boolean answer = false;
                                    foreach (var item in neigList)
                                    {
                                        if (city.Id.Equals(item.CityId))
                                            answer = true;
                                    }
                                        if(answer == false)
                                            throw new ArgumentException("Neigborhood is not exists in this city!");

                                }
                                if (change.Address != "")
                                    prosumer.Address = change.Address;
                                if (change.Latitude != "")
                                    prosumer.Latitude = change.Latitude;
                                if (change.Longitude != "")
                                    prosumer.Longitude = change.Longitude;
                                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");

                                prosumer.CityId = city.Id;
                                await _repository.Save();

                                return prosumer;
                            }
                        }
                        else
                        {
                            if (change.CityName != "")
                            {
                                City city = await _repository.getCity(change.CityName);
                                if (city == null)
                                    throw new ArgumentException("City is not valid!");

                                prosumer.CityId = city.Id;
                                
                            }
                            if (change.NeigborhoodName != "")
                            {
                                
                                    Neigborhood neig = await _repository.getNeigborhood(change.NeigborhoodName);
                                    if (prosumer.CityId.Equals(neig.CityId))
                                        prosumer.NeigborhoodId = neig.Id;
                                    else
                                        throw new ArgumentException("Neigborhood is not exists in this city!");

                                    if (neig == null)
                                        throw new ArgumentException("Neigborhood is not valid!");
                                    prosumer.NeigborhoodId = neig.Id;
                                
                            }
                            if (change.Address != "")
                                prosumer.Address = change.Address;
                            if (change.Latitude != "")
                                prosumer.Latitude = change.Latitude;
                            if (change.Longitude != "")
                                prosumer.Longitude = change.Longitude;
                            
                            prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                            prosumer.LastName = change.LastName;
                           
                            await _repository.Save();
                            return prosumer;
                        }
                    }
                    else
                    {
                        prosumer.FirstName = change.FirstName;
                        
                       
                        if (change.CityName != "")
                        {
                            City city = await _repository.getCity(change.CityName);
                            if (city == null)
                                throw new ArgumentException("City is not valid!");
                            prosumer.CityId = city.Id;
                        }
                        if (change.NeigborhoodName != "")
                        {
                            Neigborhood neig = await _repository.getNeigborhood(change.NeigborhoodName);
                            if (prosumer.CityId.Equals(neig.CityId))
                                prosumer.NeigborhoodId = neig.Id;
                            else
                                throw new ArgumentException("Neigborhood is not exists in this city!");

                            if (neig == null)
                                throw new ArgumentException("Neigborhood is not valid!");
                            prosumer.NeigborhoodId = neig.Id;
                        }
                        if (change.Address != "")
                            prosumer.Address = change.Address;
                        if (change.Latitude != "")
                            prosumer.Latitude = change.Latitude;
                        if (change.Longitude != "")
                            prosumer.Longitude = change.Longitude;

                        if (change.LastName != "")
                            prosumer.LastName = change.LastName;

                        prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                     

                        await _repository.Save();
                        return prosumer;
                    }
                  
                }
                else
                {
                   
                   if(await checkEmail(change.Email) && IsValidEmail(change.Email))
                    {
                        
                        if (change.CityName != "")
                        {
                            City city = await _repository.getCity(change.CityName);
                            if (city == null)
                                throw new ArgumentException("City is not valid!");
                            prosumer.CityId = city.Id;
                        }
                        if (change.NeigborhoodName != "")
                        {
                            Neigborhood neig = await _repository.getNeigborhood(change.NeigborhoodName);
                            if (prosumer.CityId.Equals(neig.CityId))
                                prosumer.NeigborhoodId = neig.Id;
                            else
                                throw new ArgumentException("Neigborhood is not exists in this city!");

                            if (neig == null)
                                throw new ArgumentException("Neigborhood is not valid!");
                            prosumer.NeigborhoodId = neig.Id;
                        }
                        if (change.Address != "")
                            prosumer.Address = change.Address;
                        if (change.Latitude != "")
                            prosumer.Latitude = change.Latitude;
                        if (change.Longitude != "")
                            prosumer.Longitude = change.Longitude;
                        
                        if (change.FirstName != "")
                            prosumer.FirstName = change.FirstName;
                        if (change.LastName != "")
                            prosumer.LastName = change.LastName;

                        prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                        prosumer.Email = change.Email;

                        await _repository.Save();
                        return prosumer;  

                    }
                    else
                    {
                        throw new ArgumentException("Email is not valid!");
                    }


                }
            }
            else
            {
                if(await checkUsername(change.Username))
                {
                   
                    if(change.Email != "")
                        if(await checkEmail(change.Email) && IsValidEmail(change.Email))
                            prosumer.Email = change.Email;
                        else
                            throw new ArgumentException("Email is not valid!");

                    if (change.CityName != "")
                    {
                        City city = await _repository.getCity(change.CityName);
                        if (city == null)
                            throw new ArgumentException("City is not valid!");
                        prosumer.CityId = city.Id;
                    }
                    if (change.NeigborhoodName != "")
                    {
                        Neigborhood neig = await _repository.getNeigborhood(change.NeigborhoodName);
                        if (prosumer.CityId.Equals(neig.CityId))
                            prosumer.NeigborhoodId = neig.Id;
                        else
                            throw new ArgumentException("Neigborhood is not exists in this city!");

                        if (neig == null)
                            throw new ArgumentException("Neigborhood is not valid!");
                        prosumer.NeigborhoodId = neig.Id;
                    }
                    if (change.Address != "")
                        prosumer.Address = change.Address;
                    if (change.Latitude != "")
                        prosumer.Latitude = change.Latitude;
                    if (change.Longitude != "")
                        prosumer.Longitude = change.Longitude;

                    if (change.FirstName != "")
                        prosumer.FirstName = change.FirstName;
                    if (change.LastName != "")
                        prosumer.LastName = change.LastName;

                    prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                    prosumer.Username = change.Username;


                    await _repository.Save();
                    return prosumer;

                }
                else
                {
                    throw new ArgumentException("Username is not valid!");
                }

            }

                return null;
        }



    }
}
