﻿using System.Security.Cryptography;
using System.Text;
using API.Models.Paging;
using API.Models.Users;
using API.Repositories;

namespace API.Services.ProsumerService
{
    public class ProsumerService : IProsumerService
    {

        private readonly IUserRepository _repository;
        public ProsumerService(IUserRepository repository)
        {
            _repository = repository;
        }

        public Task<PagedList<Prosumer>> GetProsumers(ProsumerParameters prosumerParameters) // to su sa parametrima page i size 
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
                return false;       //ako ne moze da ga nadje, nije editovan
            }

            //sifra
            var hmac = new HMACSHA512();
            byte[] passwordSalt = hmac.Key;
            byte[] passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newValues.Password)); 

            prosumer.FirstName = newValues.FirstName;
            prosumer.LastName = newValues.LastName;

            if (prosumer.Email.Equals(newValues.Email) || await checkEmail(newValues.Email))
                prosumer.Email = newValues.Email;
            else
                return false;       //mejl vec postoji

            prosumer.HashPassword = passwordHash;
            prosumer.SaltPassword = passwordSalt;

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
    }
}