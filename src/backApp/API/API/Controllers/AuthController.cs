using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System;
using System.Security.Cryptography.Xml;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Data;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.Security.Claims;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
      
        private readonly ProsumerRegContext _contextProsumerReg;
        private readonly IConfiguration _config;

        public AuthController(ProsumerRegContext context, IConfiguration config)
        {
            _config = config;
            _contextProsumerReg = context;
        }


        [HttpPost("register")]
        public async Task<ActionResult<Prosumer>> Register(ProsumerDto request)
        {
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Prosumer prosumer = new Prosumer(); // pravimo novog prosumer-a

            
            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = checkUserName(request);

            if (isValidEmail(request.Email))
            {
                prosumer.Id = id.ToString();
                prosumer.FirstName = request.FirstName;
                prosumer.LastName = request.LastName;
                prosumer.Username = username; // proveri validnost username 
                prosumer.Email = request.Email; // validnost email-a
                prosumer.Address = request.address;
                prosumer.Image = request.Image;
                prosumer.Token = null; // to je trenutno posle ide komunikacija
                prosumer.RoleId = 3; // -------  vratiIDRole("korisnik"); kada ga hardkodujem ne vraca gresku wtf?Morao sam ovako, izmeni sledeci put-------
                //prosumer.Role = vratiIDRole("korisnik");// ---ne radi fun ne znam zasto?
                prosumer.HashPassword = passwordHash;
                prosumer.SaltPassword = passwordSalt;
                prosumer.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                prosumer.NeigborhoodId = "trenutno"; // ovo isto vazi kao i za RegionId
                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");

                _contextProsumerReg.Prosumers.Add(prosumer);
                await _contextProsumerReg.SaveChangesAsync(); // sacuvaj promene
                return Ok(prosumer);
            }
            else
            {
                return BadRequest("Email nije validan!");
            }
            }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(ProsumerLogin request)
        {
            Prosumer prosumer = getProsumer(request.Username);  //ako postoji, uzmi prosumera iz baze

            if (prosumer == null)
                return BadRequest("This username does not exist.");

            if (!verifyPassword(request.Password, prosumer.SaltPassword, prosumer.HashPassword))    //provera sifre
                return BadRequest("Wrong password.");

            string token = CreateToken(prosumer);
            prosumer.Token = token;     //upis tokena u bazu
            await _contextProsumerReg.SaveChangesAsync();
            return Ok(token);
            
        }

        private string CreateToken(Prosumer prosumer)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, prosumer.Username)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            
            return jwt;
        }

        private bool verifyPassword(string reqPassword, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var reqPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(reqPassword));

                return passwordHash.SequenceEqual(reqPasswordHash);
            }
        }

        private Prosumer getProsumer(string username)
        {
            return _contextProsumerReg.Prosumers.FirstOrDefault(x => x.Username == username);
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

        private Role vratiIDRole(string naziv)
        {
            List<Role> sveUloge = _contextProsumerReg.Roles.ToList();

            foreach (var item in sveUloge)
            {
                if (item.RoleName.Equals(naziv))
                    return item;
            }

            return null;
        }
        private string checkUserName(ProsumerDto request)
        {
            List<Prosumer> listaProsumer = _contextProsumerReg.Prosumers.ToList();
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
        private static bool isValidEmail(string email)
        {
            Regex emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",RegexOptions.IgnoreCase);
        
            return emailRegex.IsMatch(email);
        }
        [HttpGet("UsersProsumer")]
        public async Task<ActionResult<List<Prosumer>>> ListRegisterProsumer()
        {
           

            return Ok(await _contextProsumerReg.Prosumers.ToListAsync());
        }

     
    }
}
