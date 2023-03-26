using System.Security.Cryptography;
using System.Text;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using Microsoft.AspNetCore.Mvc;

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
    }
}
