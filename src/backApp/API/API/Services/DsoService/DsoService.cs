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

            //sifra
            var hmac = new HMACSHA512();
            byte[] passwordSalt = hmac.Key;
            byte[] passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newValues.Password));

            dso.FirstName = newValues.FirstName;
            dso.LastName = newValues.LastName;
            dso.Salary = newValues.Salary;
            dso.RoleId = newValues.RoleId;
            dso.RegionId = newValues.RegionId;
            if (newValues.Email.Equals(dso.Email) || await checkEmail(newValues.Email))
                dso.Email = newValues.Email;
            else
                return false;

            dso.SaltPassword = passwordSalt;
            dso.HashPassword = passwordHash;

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
    }
}
