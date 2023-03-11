using loginProbaBackend.Data;
using loginProbaBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace loginProbaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> getAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        [HttpPost("login")]
        public async Task<IActionResult> getUserByUsername([FromBody] LoginDto loginUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginUser.username);
            if(user is null)
            {
                return BadRequest(new
                {
                    error = true,
                    message = "User Not Found!"
                });
            }
            else
            {
                if(user.Password==loginUser.password) 
                {
                    var userToken = createJWT(user); //trebalo bi u bazi da se cuva ali to nisam ovde implementirala jer samo zbog fronta pravim ovaj backend
                    return Ok(new
                    {
                        error = false,
                        message = loginUser.username,
                        token = userToken
                    });
                }
                return BadRequest(new
                {
                    error = true,
                    message = "Incorrect Password!"
                });
            }
            
        }

        [HttpPost]
        public async Task<IActionResult> addUser([FromBody] NewUser newUser)
        {
            User user = new User();
            user.Username = newUser.Username;
            user.Password = newUser.Password;
            user.Name = newUser.Name;
            user.Id = new Guid();

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    error = false,
                    message = user.Username
                });
            }
            catch(Exception e)
            {
                return Ok(new
                {
                    error = true,
                    message = "Error Occurred!"
                });
            }
        }

        private string createJWT(User user) 
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("itsasecretabigbigbigsecret...");
            var identity = new ClaimsIdentity(new Claim[]
            {
                //new Claim(ClaimTypes.Role, user.Role)
                new Claim(ClaimTypes.Name, user.Name)
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key),SecurityAlgorithms.HmacSha256); //ovo drugo je algoritam koji koristimo za kreiranje tokena

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(3),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
    }
}
