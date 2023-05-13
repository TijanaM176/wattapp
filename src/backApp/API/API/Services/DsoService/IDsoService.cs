using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using Microsoft.AspNetCore.Mvc;

namespace API.Services.DsoService
{
    public interface IDsoService
    {
        public Task<bool> DeleteDsoWorker(string id);
        public Task<Dso> GetDsoWorkerById(string id);
        public Task<bool> EditDsoWorker(string id, DsoEdit newValues);
        public Task<List<Dso>> GetAllDsos();
        public Task<List<string>> getEmails();
        public Task<bool> checkEmail(string email);
        public Task<List<Dso>> GetDsoWorkersByRegionId(string RegionID);
        public Task<List<Dso>> GetWorkersbyRoleId(long RoleID);
        public Task<IEnumerable<Dso>> GetWorkerByFilter(string RegionID, long RoleID);
        Task<PagedList<Dso>> GetDsoWorkers(DsoWorkerParameters dsoWorkersParameters);
        public Task<List<Role>> GetRoles();
        public Task<List<Region>> GetRegions();
        public Task<string> GetRoleName(long id);
        public Task<string> GetRegionName(string id);
        public Task<Prosumer> UpdateProsumerByDso(ChangeProsumerbyDSO change);
        public Task<double> ProsumerCount();
        public Task<List<ElectricityPrice>> Prices();
        public Task<Dictionary<string, double>> CurrentPrice();
        public Task<bool> DeleteImage(String WorkerID);
        public Task<(String, Boolean)> SaveImage(String WorkerID, string base64string);
        public Task<bool> ChangePasswordDSO(string id, string oldPassword, string newPassword);
    }
}
