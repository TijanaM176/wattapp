using loginProbaBackend.Data;
using loginProbaBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                    return Ok(new
                    {
                        error = false,
                        message = loginUser.username
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
                return BadRequest(new
                {
                    error = true,
                    message = "Error Occurred!"
                });
            }
        }

    }
}
