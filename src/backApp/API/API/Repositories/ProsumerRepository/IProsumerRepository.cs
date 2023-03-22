﻿using API.Models.Paging;
using API.Models.Users;
using API.Repositories.BaseHelpRepository;

namespace API.Repositories.ProsumerRepository
{
    public interface IProsumerRepository : IBaseRepository<Prosumer>
    {
    
        public Task<List<Prosumer>> GetAllProsumers();
        //public Task<List<Dso>> GetAllDsos();
        public Task<Prosumer> GetProsumer(string usernameOrEmail);
        //public Task<Dso> GetDSO(string usernameOrEmail);
        public Task<Prosumer> GetProsumerWithToken(string token);
        //public Task<Dso> GetDSOWithToken(string token);
        public Task<Prosumer> GetProsumerById(string id);
        Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters);
        public Task InsertProsumer(Prosumer prosumer);
        //public Task InsertDSOWorker(Dso DSO_Worker);
       
        //public Task<Dso> GetDsoWorkerById(string id);
        //public Task DeleteDsoWorker(string id);
        public Task DeleteProsumer(string id);
   
    }
}