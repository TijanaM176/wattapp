using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        public User user = new User();


        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            user.Username = request.Username;
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            return Ok(user);
        }

        // jason web token samo sam napisao

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512()) // System.Security.Cryptography; Computes a Hash-based Message Authentication Code (HMAC) using the SHA512 hash function.
            {

                passwordSalt = hmac.Key;

                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)); // using System.Text;   to je property Encoding.UTF8


            }

        }
    }
}
