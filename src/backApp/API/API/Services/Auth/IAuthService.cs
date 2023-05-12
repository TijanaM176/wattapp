using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Microsoft.AspNetCore.Mvc;
using API.Models.Users;

namespace API.Services.Auth
{
    public interface IAuthService
    {

        public Task<string> CheckUserName(UserDto request);
        public Task<bool> checkEmail(UserDto request);
        public bool IsValidEmail(string email);
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
        public Task<bool> InsertProsumer(Prosumer prosumer);
        public Task<bool> InsertDSOWorker(Dso DSO_Worker);
        public bool VerifyPassword(string reqPassword, byte[] passwordSalt, byte[] passwordHash);
        public Task<Role> getRole(string naziv);
        public Task<Neigborhood> getNeigborhood(string naziv);
        public Task<Region> getRegion(string naziv);
        public Task<City> getCity(string naziv);
        public Task<string> getRoleName(long? id);
        public Task<Prosumer> GetProsumer(string usernameOrEmail);
        public Task<Dso> GetDSO(string usernameOrEmail);
        public Task<string> CreateToken(User user);
        public Task<bool> SaveToken(User user, string token);
        public Task<bool> SaveToken(User user, string token, DateTime expiry);
        //public Task<List<Prosumer>> GetAllProsumers();
        public RefreshToken GenerateRefreshToken();
        public string CreateRandomToken();
        public Task<Prosumer> GetProsumerWithToken(string token);
        public Task<Dso> GetDSOWithToken(string token);
        public Task<Prosumer> Register(ProsumerDto request);
        public Task<Dso> Register(DsoWorkerDto request);

        public (int, string) SaveImage(IFormFile ImageFile);
        public Boolean DeleteImage(String ImageFileName);
        public Task<bool> DeleteToken(string username, string role);
    }
}
