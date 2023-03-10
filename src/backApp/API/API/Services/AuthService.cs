using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class AuthService
    {
        private readonly ProsumerRegContext _context;
        private readonly IConfiguration _config;
        public AuthService(ProsumerRegContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        //REGISTER

        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512()) // System.Security.Cryptography; Computes a Hash-based Message Authentication Code (HMAC) using the SHA512 hash function.
            {
                passwordSalt = hmac.Key;

                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)); // using System.Text;   to je property Encoding.UTF8


            }

        }

        public Role VratiIDRole(string naziv)
        {
            List<Role> sveUloge = _context.Roles.ToList();

            foreach (var item in sveUloge)
            {
                if (item.RoleName.Equals(naziv))
                    return item;
            }

            return null;
        }
        public string CheckUserName(ProsumerDto request)
        {
            List<Prosumer> listaProsumer = _context.Prosumers.ToList();
            List<String> listaUsername = new List<String>();
            string username = "";
            Boolean check = true;
            foreach (var item in listaProsumer)
            {
                listaUsername.Add(item.Username);
            }

            while (check)
            {
                if (listaUsername.Contains(username = request.getUsername()))
                    check = true;
                else
                    check = false;
            }



            return username;
        }

        public bool IsValidEmail(string email)
        {
            Regex emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", RegexOptions.IgnoreCase);

            return emailRegex.IsMatch(email);
        }

        public async void InsertProsumer(Prosumer prosumer)
        {
            _context.Prosumers.Add(prosumer);
            await _context.SaveChangesAsync(); // sacuvaj promene
        }


        //LOGIN
        public bool VerifyPassword(string reqPassword, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var reqPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(reqPassword));

                return passwordHash.SequenceEqual(reqPasswordHash);
            }
        }

        public Prosumer GetProsumer(string usernameOrEmail)
        {
            return _context.Prosumers.FirstOrDefault(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }

        public DSO GetDSO(string usernameOrEmail)
        {
            return _context.DSOs.FirstOrDefault(x => x.Username == usernameOrEmail || x.Email == usernameOrEmail);
        }

        public string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        public void SaveToken(User user, string token)
        {
            user.Token = token;
            _context.SaveChangesAsync();
        }

        public async Task<List<Prosumer>> GetAllProsumers()
        {
            return await _context.Prosumers.ToListAsync();
        }
    }
}
