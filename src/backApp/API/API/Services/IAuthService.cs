using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace API.Services
{
    public interface IAuthService
    {
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);

        public Task<Role> getRole(string naziv);
        public Task<string> getRoleName(long? id);
        public Task<string> CheckUserName(ProsumerDto request);
        public Task<Boolean> checkEmail(ProsumerDto request);


        public bool IsValidEmail(string email);

        public void InsertProsumer(Prosumer prosumer);

        public void InsertDSOWorker(Dso DSO_Worker);
        public Task<string> CheckUserNameDSO(DsoWorkerDto request);
        public Task<Boolean> checkEmail(DsoWorkerDto request);

        public bool VerifyPassword(string reqPassword, byte[] passwordSalt, byte[] passwordHash);

        public Task<Prosumer> GetProsumer(string usernameOrEmail);

        public Task<Dso> GetDSO(string usernameOrEmail);


        public Task<string> CreateToken(User user);


        public void SaveToken(User user, string token);

        public Task<List<Prosumer>> GetAllProsumers();
        public RefreshToken GenerateRefreshToken();
        public string CreateRandomToken();
        public Task<Prosumer> GetProsumerWithToken(string token);
        public Task<Dso> GetDSOWithToken(string token);
    }
}
