﻿using API.Models.Users;

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
    }
}