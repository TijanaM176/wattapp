using API.Models.Users;
using API.Repositories;

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

            dso.FirstName = newValues.FirstName;
            dso.LastName = newValues.LastName;
            dso.Salary = newValues.Salary;
            dso.RoleId = newValues.RoleId;
            dso.RegionId = newValues.RegionId;

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
    }
}
